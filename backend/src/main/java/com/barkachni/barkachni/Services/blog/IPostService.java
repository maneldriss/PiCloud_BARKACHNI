package com.barkachni.barkachni.Services.blog;


import com.barkachni.barkachni.entities.blog.Post;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface IPostService {

    Post addPost(Post post);
    Post addPost(Post post, MultipartFile imageFile, MultipartFile videoFile) throws IOException;
    Post updatePost(Post post);
    void deletePost(Long id);
    List<Post> retrieveAllPosts();
    Post retrievePost(Long id);
}
