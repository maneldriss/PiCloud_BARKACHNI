package com.example.projettp.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService() {
        Dotenv dotenv = Dotenv.load();
        cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", dotenv.get("CLOUDINARY_CLOUD_NAME"),
                "api_key", dotenv.get("CLOUDINARY_API_KEY"),
                "api_secret", dotenv.get("CLOUDINARY_API_SECRET")
        ));
    }

    public String uploadFile(MultipartFile file, String folder) {
        try {
            if (file.isEmpty()) {
                return null;
            }

            Map<String, Object> params = ObjectUtils.asMap(
                    "folder", folder,
                    "resource_type", "auto",
                    "use_filename", true,
                    "unique_filename", false,
                    "overwrite", true
            );

            Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), params);
            return uploadResult.get("url").toString();

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file", e);
        }
    }
    public String uploadFile(MultipartFile file) {
        return uploadFile(file, "default");
    }
}
