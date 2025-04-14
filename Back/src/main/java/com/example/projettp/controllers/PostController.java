package com.example.projettp.controllers;

import com.example.projettp.entities.Post;
import com.example.projettp.entities.User;
import com.example.projettp.repository.PostRepository;
import com.example.projettp.repository.UserRepository;
import com.example.projettp.services.IPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/posts")
public class PostController {

    @Autowired
    private PostRepository postRepository;
    @Autowired
    private UserRepository userRepository;
    private final IPostService postService;

    public PostController(IPostService postService) {
        this.postService = postService;
    }

    @PostMapping(value = "/{userId}/posts", consumes = {"multipart/form-data"})
    public ResponseEntity<Post> addPost(
            @PathVariable Long userId,
            @RequestPart("post") Post post,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile,
            @RequestPart(value = "videoFile", required = false) MultipartFile videoFile) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id " + userId));

        post.setUser(user);

        Post savedPost = postService.addPost(post, imageFile, videoFile);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedPost);
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
    public ResponseEntity<Post> updatePost(@PathVariable Long userId, @RequestBody Post post) {
        // Récupérer l'utilisateur par son ID
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id " + userId));

        // Lier l'utilisateur au post
        post.setUser(user);

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



    @GetMapping
    public List<Post> getAllPosts() {
        return postService.retrieveAllPosts();
    }

    @GetMapping("/{id}")
    public Post getPostById(@PathVariable Long id) {
        return postService.retrievePost(id);
    }
}
