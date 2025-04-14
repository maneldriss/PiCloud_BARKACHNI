package com.example.projettp.controllers;


import com.example.projettp.entities.LikeDislike;
import com.example.projettp.entities.Post;
import com.example.projettp.entities.User;
import com.example.projettp.repository.LikeDislikeRepository;
import com.example.projettp.repository.PostRepository;
import com.example.projettp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
    public String likePost(@PathVariable Long userId, @PathVariable Long postId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        LikeDislike existing = likeDislikeRepository.findByUserAndPost(user, post).orElse(null);

        if (existing == null) {
            LikeDislike like = new LikeDislike();
            like.setUser(user);
            like.setPost(post);
            like.setLiked(true);
            like.setDisliked(false);
            likeDislikeRepository.save(like);
            return "Post liked";
        } else {
            existing.setLiked(true);
            existing.setDisliked(false);
            likeDislikeRepository.save(existing);
            return "Post updated to like";
        }
    }

    @PostMapping("/{userId}/post/{postId}/dislike")
    public String dislikePost(@PathVariable Long userId, @PathVariable Long postId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        LikeDislike existing = likeDislikeRepository.findByUserAndPost(user, post).orElse(null);

        if (existing == null) {
            LikeDislike dislike = new LikeDislike();
            dislike.setUser(user);
            dislike.setPost(post);
            dislike.setLiked(false);
            dislike.setDisliked(true);
            likeDislikeRepository.save(dislike);
            return "Post disliked";
        } else {
            existing.setLiked(false);
            existing.setDisliked(true);
            likeDislikeRepository.save(existing);
            return "Post updated to dislike";
        }
    }
}
