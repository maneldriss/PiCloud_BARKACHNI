package com.example.projettp.services;

import com.example.projettp.entities.Post;
import com.example.projettp.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.example.projettp.services.CloudinaryService;


import java.util.List;

@Service
public class PostServiceImplement  implements IPostService{

    @Autowired
    private PostRepository postRepository;
    @Autowired
    private CloudinaryService cloudinaryService;
    @Override
    public Post addPost(Post post) {
        return postRepository.save(post);
    }
    @Override
    public Post addPost(Post post, MultipartFile imageFile, MultipartFile videoFile) {
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = cloudinaryService.uploadFile(imageFile, "posts/images");
            post.setImageUrl(imageUrl);
        }

        if (videoFile != null && !videoFile.isEmpty()) {
            String videoUrl = cloudinaryService.uploadFile(videoFile, "posts/videos");
            post.setVideoUrl(videoUrl);
        }

        return postRepository.save(post);
    }
    @Override
    public Post updatePost(Post post) {
        if (postRepository.existsById(post.getIdPost())) {
            return postRepository.save(post);
        }
        throw new RuntimeException("Post not found!");
    }

    @Override
    public void deletePost(Long id) {
        if (postRepository.existsById(id)) {
            postRepository.deleteById(id);
        } else {
            throw new RuntimeException("Post not found!");
        }
    }

    @Override
    public List<Post> retrieveAllPosts() {
        return postRepository.findAll();
    }

    @Override
    public Post retrievePost(Long id) {
        return postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post not found!"));
    }
}
