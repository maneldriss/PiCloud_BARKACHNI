    package com.barkachni.barkachni.Services.Dressing;

    import org.springframework.beans.factory.annotation.Value;
    import org.springframework.core.io.ByteArrayResource;
    import org.springframework.http.HttpEntity;
    import org.springframework.http.HttpHeaders;
    import org.springframework.http.MediaType;
    import org.springframework.http.ResponseEntity;
    import org.springframework.stereotype.Service;
    import org.springframework.util.LinkedMultiValueMap;
    import org.springframework.util.MultiValueMap;
    import org.springframework.web.client.RestTemplate;
    import org.springframework.web.multipart.MultipartFile;

    import java.io.File;
    import java.io.FileOutputStream;
    import java.io.IOException;
    import java.nio.file.Files;
    import java.nio.file.Path;
    import java.nio.file.Paths;
    import java.util.UUID;


    @Service
    public class ImageProcessingService {
        @Value("${app.upload.dir:${user.home}/uploads}")
        private String uploadDir;

        @Value("${removebg.api.key:8UfaMFzLZD6NpdJMtHJzbAYx}")
        private String removeBgApiKey;

        @Value("${app.base.url:http://localhost:8080}")
        private String baseUrl;

        @Value("${server.servlet.context-path:/}")
        private String contextPath;

        private final RestTemplate restTemplate = new RestTemplate();

        public String processAndStoreImage(MultipartFile imageFile) throws IOException {
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            String originalFilename = imageFile.getOriginalFilename();
            String fileExtension = getFileExtension(originalFilename);
            String tempFileName = UUID.randomUUID() + fileExtension;
            File tempFile = new File(directory, tempFileName);

            try (FileOutputStream fos = new FileOutputStream(tempFile)) {
                fos.write(imageFile.getBytes());
            } catch (IOException e) {
                throw new RuntimeException(e);
            }

            byte[] processedImageBytes = removeImageBackground(tempFile);

            String processedFileName = UUID.randomUUID() + ".png";
            Path processedFilePath = Paths.get(uploadDir, processedFileName);

            Files.write(processedFilePath, processedImageBytes);

            tempFile.delete();

            return baseUrl + contextPath + "/images/serve/" + processedFileName;
        }

        private byte[] removeImageBackground(File imageFile) throws IOException {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            headers.set("X-Api-Key", removeBgApiKey);

            MultiValueMap<String, Object> formData = new LinkedMultiValueMap<>();

            ByteArrayResource fileResource = new ByteArrayResource(Files.readAllBytes(imageFile.toPath())) {
                @Override
                public String getFilename() {
                    return imageFile.getName();
                }
            };
            formData.add("image_file", fileResource);
            formData.add("size", "auto");

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(formData, headers);

            ResponseEntity<byte[]> response = restTemplate.postForEntity(
                    "https://api.remove.bg/v1.0/removebg",
                    requestEntity,
                    byte[].class
            );

            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new IOException("Failed to remove background. API returned status: " + response.getStatusCodeValue());
            }

            return response.getBody();
        }


        public byte[] getStoredImage(String filename) throws IOException {
            Path imagePath = Paths.get(uploadDir, filename);
            if (!Files.exists(imagePath)) {
                throw new IOException("Image file not found: " + filename);
            }
            return Files.readAllBytes(imagePath);
        }

        private String getFileExtension(String filename) {
            if (filename == null) {
                return ".jpg";
            }
            int lastDotIndex = filename.lastIndexOf('.');
            if (lastDotIndex > 0) {
                return filename.substring(lastDotIndex);
            }
            return ".jpg";
        }
    }