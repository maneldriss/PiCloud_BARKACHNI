package com.example.projettp.services;

import com.example.projettp.entities.Post;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IPostService {

    Post addPost(Post post);
    Post addPost(Post post, MultipartFile imageFile, MultipartFile videoFile);
    Post updatePost(Post post);
    void deletePost(Long id);
    List<Post> retrieveAllPosts();
    Post retrievePost(Long id);
}
