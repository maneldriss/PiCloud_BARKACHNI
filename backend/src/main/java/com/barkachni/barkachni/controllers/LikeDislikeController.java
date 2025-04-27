package com.barkachni.barkachni.controllers;



import com.barkachni.barkachni.entities.blog.LikeDislike;
import com.barkachni.barkachni.entities.blog.Post;
import com.barkachni.barkachni.entities.user.User;
import com.barkachni.barkachni.entities.user.UserRepository;
import com.barkachni.barkachni.repositories.blog.LikeDislikeRepository;
import com.barkachni.barkachni.repositories.blog.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.core.Authentication;

import java.util.Collections;
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

    @PostMapping("/post/{postId}/like")
    public ResponseEntity<Map<String, String>> likePost(
            @PathVariable Long postId,
            @AuthenticationPrincipal User currentUser) {

        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", "User not authenticated"));
        }

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));

        LikeDislike existing = likeDislikeRepository.findByUserAndPost(currentUser, post).orElse(null);
        String message;

        if (existing == null) {
            LikeDislike like = new LikeDislike();
            like.setUser(currentUser);
            like.setPost(post);
            like.setLiked(true);
            like.setDisliked(false);
            likeDislikeRepository.save(like);
            message = "Post liked";
        } else if (existing.isLiked()) {
            message = "Post already liked";
        } else {
            existing.setLiked(true);
            existing.setDisliked(false);
            likeDislikeRepository.save(existing);
            message = "Post updated to like";
        }

        return ResponseEntity.ok(Collections.singletonMap("message", message));
    }

    @PostMapping("/post/{postId}/dislike") // Même structure que le like
    public ResponseEntity<Map<String, String>> dislikePost(
            @PathVariable Long postId,
            @AuthenticationPrincipal User currentUser) {

        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", "User not authenticated"));
        }

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        LikeDislike existing = likeDislikeRepository.findByUserAndPost(currentUser, post).orElse(null);
        String message;

        if (existing == null) {
            LikeDislike dislike = new LikeDislike();
            dislike.setUser(currentUser);
            dislike.setPost(post);
            dislike.setLiked(false);
            dislike.setDisliked(true);
            likeDislikeRepository.save(dislike);
            message = "Post disliked";
        } else if (existing.isDisliked()) {
            message = "Post already disliked";
        } else {
            existing.setLiked(false);
            existing.setDisliked(true);
            likeDislikeRepository.save(existing);
            message = "Post updated to dislike";
        }

        return ResponseEntity.ok(Collections.singletonMap("message", message));
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
