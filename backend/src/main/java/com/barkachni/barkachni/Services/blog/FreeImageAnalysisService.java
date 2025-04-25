package com.barkachni.barkachni.Services.blog;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ByteArrayEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.HttpEntity;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.stream.Collectors;

@Service
public class FreeImageAnalysisService {

    @Value("${huggingface.api.key}")
    private String apiKey;

    public String generateImageDescription(MultipartFile imageFile) throws IOException {
        byte[] imageBytes = imageFile.getBytes();

        // Envoyer directement les bytes de l'image
        String baseDescription = getBaseDescription(imageBytes);
        String colors = detectColors(imageBytes);
        String material = detectMaterial(imageBytes);

        return String.format(
                " %s. Palette de couleurs : %s. Matériaux : %s. " +
                        "Coupe moderne pour une silhouette élégante.",
                baseDescription,
                colors.isEmpty() ? "non détecté" : colors,
                material.isEmpty() ? "matières premium" : material
        );
    }

    private String getBaseDescription(byte[] imageBytes) throws IOException {
        String apiUrl = "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large";

        HttpPost post = new HttpPost(apiUrl);
        post.setHeader("Authorization", "Bearer " + apiKey);

        // Envoyer l'image directement en binaire
        post.setEntity(new ByteArrayEntity(imageBytes, ContentType.IMAGE_JPEG));

        try (CloseableHttpClient httpClient = HttpClients.createDefault();
             CloseableHttpResponse response = httpClient.execute(post)) {

            String responseBody = EntityUtils.toString(response.getEntity());
            JsonNode rootNode = new ObjectMapper().readTree(responseBody);

            // Nouvelle vérification de la structure
            if (rootNode.has("generated_text")) {
                return rootNode.get("generated_text").asText();
            }

            if (rootNode.isArray() && rootNode.size() > 0) {
                return rootNode.get(0).get("generated_text").asText();
            }

            throw new IOException("Format de réponse non reconnu: " + responseBody);
        }
    }

    private String detectColors(byte[] imageBytes) throws IOException {
        String apiUrl = "https://api-inference.huggingface.co/models/google/vit-base-patch16-384";

        HttpPost post = new HttpPost(apiUrl);
        post.setHeader("Authorization", "Bearer " + apiKey);

        String imageBase64 = Base64.getEncoder().encodeToString(imageBytes);
        String jsonBody = "{ \"inputs\": \"" + imageBase64 + "\" }";

        post.setEntity(new StringEntity(jsonBody, ContentType.APPLICATION_JSON));

        try (CloseableHttpClient client = HttpClients.createDefault();
             CloseableHttpResponse response = client.execute(post)) {

            if (response.getStatusLine().getStatusCode() != 200) {
                throw new IOException("Erreur API: " + response.getStatusLine());
            }

            JsonNode root = new ObjectMapper().readTree(EntityUtils.toString(response.getEntity()));


            if (root.has("error")) {
                throw new IOException("Erreur de détection: " + root.get("error").asText());
            }

            return root.findValuesAsText("label").stream()
                    .filter(label -> label.matches("(?i)rouge|bleu|vert|jaune|noir|blanc|rose|gris|violet|orange|beige|marron"))
                    .map(color -> {
                        if ("white".equalsIgnoreCase(color)) return "blanc immaculé";
                        if ("black".equalsIgnoreCase(color)) return "noir intense";
                        return color;
                    })
                    .collect(Collectors.joining(", "));
        }


    }
    private String detectMaterial(byte[] imageBytes) throws IOException {
        HttpPost post = new HttpPost("https://api-inference.huggingface.co/models/facebook/detr-resnet-50");
        post.setHeader("Authorization", "Bearer " + apiKey);
        post.setEntity(new ByteArrayEntity(imageBytes));

        try (CloseableHttpClient client = HttpClients.createDefault();
             CloseableHttpResponse response = client.execute(post)) {

            JsonNode root = new ObjectMapper().readTree(EntityUtils.toString(response.getEntity()));
            return root.findValuesAsText("label").stream()
                    .filter(label -> label.matches("(?i)wool|cotton|silk|linen|leather"))
                    .map(material -> {
                        if ("wool".equalsIgnoreCase(material)) return "laine";
                        if ("cotton".equalsIgnoreCase(material)) return "coton bio";
                        return material;
                    })
                    .collect(Collectors.joining(", "));
        }
    }
}