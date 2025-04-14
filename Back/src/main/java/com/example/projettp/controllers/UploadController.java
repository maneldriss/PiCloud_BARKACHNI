package com.example.projettp.controllers;

import com.example.projettp.entities.Post;
import com.example.projettp.services.CloudinaryService;
import com.example.projettp.services.PostServiceImplement;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin("*")
public class UploadController {

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private PostServiceImplement postService;

    // Endpoint pour uploader l'image et l'associer à un post
    @PostMapping("/image/{postId}")
    @Schema(description = "Upload an image for a specific post to Cloudinary and save it in the database")
    public String uploadImageForPost(
            @Parameter(description = "ID du post auquel l'image sera associée")
            @PathVariable("postId") Long postId,
            @Parameter(description = "Le fichier image à uploader")
            @RequestParam("file") MultipartFile file) {

        try {
            // Upload de l'image vers Cloudinary
            String imageUrl = cloudinaryService.uploadFile(file);

            // Récupérer le post existant
            Post post = postService.retrievePost(postId);

            // Mettre à jour l'URL de l'image du post
            post.setImageUrl(imageUrl);

            // Sauvegarder le post avec la nouvelle URL de l'image
            postService.updatePost(post);

            return "Image uploaded and post updated successfully!";
        } catch (Exception e) {
            return "Upload failed: " + e.getMessage();
        }
    }
}
