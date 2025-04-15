package com.barkachni.barkachni.auth;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
@Slf4j
@Service
@RequiredArgsConstructor
public class CloudinaryService {
    private final Cloudinary cloudinary;

    public String uploadImage(MultipartFile file) throws IOException {
        try {
            // Validation supplémentaire
            if (file.getSize() > 5_000_000) { // 5MB max
                throw new IOException("File size too large");
            }

            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "resource_type", "auto",
                            "folder", "profile_pictures"
                    )
            );

            log.debug("Cloudinary upload result: {}", uploadResult);
            return uploadResult.get("secure_url").toString();

        } catch (Exception e) {
            log.error("Cloudinary upload error: {}", e.getMessage());
            throw e;
        }
    }

    public void deleteImage(String imageUrl) throws IOException {
        String publicId = extractPublicIdFromUrl(imageUrl);
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }

    private String extractPublicIdFromUrl(String url) {
        // Logique pour extraire le public_id de l'URL Cloudinary
        return url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf("."));
    }
}
