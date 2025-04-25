package com.barkachni.barkachni.controllers;


import com.barkachni.barkachni.Services.blog.FreeImageAnalysisService;
import com.barkachni.barkachni.Services.blog.IPostService;
import com.barkachni.barkachni.entities.blog.Post;
import com.barkachni.barkachni.entities.user.User;
import com.barkachni.barkachni.entities.user.UserRepository;
import com.barkachni.barkachni.repositories.blog.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/posts")
public class PostController {

    @Autowired
    private PostRepository postRepository;
    @Autowired
    private UserRepository userRepository;
    private final IPostService postService;
    @Autowired
    private FreeImageAnalysisService freeImageAnalysisService;

    public PostController(IPostService postService) {
        this.postService = postService;
    }


    // Nouvel endpoint pour la génération seule
    @PostMapping(value = "/generate-description", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> generateDescription(@RequestParam("imageFile") MultipartFile imageFile) {
        try {
            String description = freeImageAnalysisService.generateImageDescription(imageFile);
            return ResponseEntity.ok(description);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", "Échec de la génération",
                            "details", e.getMessage()
                    ));
        }

    }
    @PostMapping(value = "/add-post", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addPost(
            @RequestPart("post") Post post,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile,
            @RequestPart(value = "videoFile", required = false) MultipartFile videoFile,
            @AuthenticationPrincipal User currentUser) {

        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("User not authenticated");
        }


        try {
            // Associer le post à l'utilisateur actuel
            post.setUser(currentUser);

            // Ajouter le post
            Post savedPost = postService.addPost(post, imageFile, videoFile);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedPost);

        } catch (Exception e) {
            // Log l'erreur pour le débogage
            return ResponseEntity.internalServerError().body(Map.of(
                    "error", "Erreur lors de la création du post",
                    "details", e.getMessage()
            ));
        }
    }

    /*@PostMapping("/{userId}/posts")
    public ResponseEntity<Post> addPost(@PathVariable Long userId, @RequestBody Post post) {
        // Récupérer l'utilisateur par son ID
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id " + userId));

        // Lier l'utilisateur au post
        post.setUser(user);  // Lier le post à l'utilisateur


        // Sauvegarder le post
        Post savedPost = postRepository.save(post);

        return ResponseEntity.ok(savedPost);  // Retourner le post sauvegardé
    }*/
    @PutMapping("/{userId}/posts")
        public ResponseEntity<Post> updatePost(@PathVariable Long userId, @RequestBody Post post ) {
            // Récupérer l'utilisateur par son ID
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

            post.setUser(user); // Make sure the post is linked to the current user

            // Sauvegarder le post mis à jour
            Post updatedPost = postRepository.save(post);

            return ResponseEntity.ok(updatedPost);  // Retourner le post mis à jour
    }


    /*@DeleteMapping("/{id}")
    public void deletePost(@PathVariable Long id) {
        postService.deletePost(id);
    }*/
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id); // Suppression logique
        return ResponseEntity.noContent().build(); // Réponse vide en cas de succès
    }



    @GetMapping("/getposts")
    public ResponseEntity<Page<Post>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Post> posts = postRepository.findAll(pageable);

        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable Long id) {
        Post post = postService.retrievePost(id);
        return ResponseEntity.ok(post);
    }
}
