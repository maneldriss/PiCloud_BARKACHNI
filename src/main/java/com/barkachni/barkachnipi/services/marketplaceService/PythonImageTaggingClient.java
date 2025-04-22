package com.barkachni.barkachnipi.services.marketplaceService;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Map;

@Component
public class PythonImageTaggingClient {
    private final RestTemplate restTemplate;
    private final String PYTHON_API_URL = "http://localhost:5000/predict-category";

    public PythonImageTaggingClient() {
        this.restTemplate = new RestTemplate();
        // Configure timeout using SimpleClientHttpRequestFactory
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(5000); // 5 seconds
        requestFactory.setReadTimeout(15000); // 15 seconds
        this.restTemplate.setRequestFactory(requestFactory);
    }

    public String predictCategory(MultipartFile imageFile) throws IOException {
        try {
            // 1. Prepare headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            // 2. Prepare file part using ByteArrayResource
            ByteArrayResource fileResource = new ByteArrayResource(imageFile.getBytes()) {
                @Override
                public String getFilename() {
                    return imageFile.getOriginalFilename(); // Preserve filename
                }
            };

            // 3. Build multipart request
            LinkedMultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", fileResource);

            HttpEntity<LinkedMultiValueMap<String, Object>> requestEntity =
                    new HttpEntity<>(body, headers);

            // 4. Make the request
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    PYTHON_API_URL,
                    requestEntity,
                    Map.class
            );

            // 5. Extract and return the category
            return (String) response.getBody().get("primary_category");

        } catch (RestClientException e) {
            throw new IOException("AI service call failed: " + e.getMessage(), e);
        }
    }
}
