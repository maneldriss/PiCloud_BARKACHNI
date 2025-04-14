package com.example.projettp.controllers;


import com.example.projettp.entities.LikeDislike;
import com.example.projettp.entities.Post;
import com.example.projettp.entities.User;
import com.example.projettp.repository.LikeDislikeRepository;
import com.example.projettp.repository.PostRepository;
import com.example.projettp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/likes")
public class LikeDislikeController {
    @Autowired
    private LikeDislikeRepository likeDislikeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @PostMapping("/{userId}/post/{postId}/like")
    public ResponseEntity<Map<String, String>> likePost(@PathVariable Long userId, @PathVariable Long postId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));

        LikeDislike existing = likeDislikeRepository.findByUserAndPost(user, post).orElse(null);
        String message;

        if (existing == null) {
            // Créer un nouveau like
            LikeDislike like = new LikeDislike();
            like.setUser(user);
            like.setPost(post);
            like.setLiked(true);
            like.setDisliked(false);
            likeDislikeRepository.save(like);
            message = "Post liked";
        } else if (existing.isLiked()) {
            // Si le post est déjà liké, renvoyez une réponse différente
            message = "Post already liked";
        } else {
            // Si le post était disliké, on le met à jour pour le liker
            existing.setLiked(true);
            existing.setDisliked(false);
            likeDislikeRepository.save(existing);
            message = "Post updated to like";
        }

        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return ResponseEntity.ok(response);
    }


    @PostMapping("/{userId}/post/{postId}/dislike")
    public ResponseEntity<Map<String, String>> dislikePost(@PathVariable Long userId, @PathVariable Long postId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        LikeDislike existing = likeDislikeRepository.findByUserAndPost(user, post).orElse(null);
        String message;

        if (existing == null) {
            LikeDislike dislike = new LikeDislike();
            dislike.setUser(user);
            dislike.setPost(post);
            dislike.setLiked(false);
            dislike.setDisliked(true);
            likeDislikeRepository.save(dislike);
            message = "Post disliked";
        } else {
            existing.setLiked(false);
            existing.setDisliked(true);
            likeDislikeRepository.save(existing);
            message = "Post updated to dislike";
        }

        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/count/post/{postId}")
    public Map<String, Long> countLikesAndDislikes(@PathVariable Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        long likes = likeDislikeRepository.countByPostAndLikedTrue(post);
        long dislikes = likeDislikeRepository.countByPostAndDislikedTrue(post);

        Map<String, Long> response = new HashMap<>();
        response.put("likes", likes);
        response.put("dislikes", dislikes);

        return response;
    }

    @GetMapping("/users/{postId}")
    public ResponseEntity<List<String>> getUsersWhoLikedPost(@PathVariable Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        List<User> users = likeDislikeRepository.findUsersWhoLiked(post);

        List<String> userNames = users.stream()
                .map(User::getUsername)
                .collect(Collectors.toList());

        return ResponseEntity.ok(userNames);
    }


    @GetMapping("/dislikes/users/{postId}")
    public ResponseEntity<List<String>> getUsersWhoDislikedPost(@PathVariable Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        List<User> users = likeDislikeRepository.findUsersWhoDisliked(post);

        List<String> userNames = users.stream()
                .map(User::getUsername)
                .collect(Collectors.toList());

        return ResponseEntity.ok(userNames);
    }

}
