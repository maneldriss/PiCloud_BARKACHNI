package com.barkachni.barkachni.Services.blog;

import io.github.cdimascio.dotenv.Dotenv;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;


@Service("cloudinaryServiceblog")
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

    public String uploadVideo(MultipartFile videoFile) throws IOException {
        Map<String, Object> params = new HashMap<>();
        params.put("resource_type", "video");
        params.put("chunk_size", 6000000); // 6MB par chunk
        params.put("timeout", 120000); // 2 minutes timeout

        return cloudinary.uploader()
                .upload(videoFile.getBytes(), params)
                .get("url").toString();
    }
    public String uploadFile(MultipartFile file) {
        return uploadFile(file, "default");
    }
}
