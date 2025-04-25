package com.barkachni.barkachni.Services.blog;


import com.barkachni.barkachni.entities.blog.Post;
import com.barkachni.barkachni.repositories.blog.PostRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;



import java.io.IOException;
import java.util.List;

@Service
public class PostServiceImplement  implements IPostService{

    @Autowired
    private PostRepository postRepository;
    @Autowired
    private CloudinaryService cloudinaryService;
    @Autowired
    private FreeImageAnalysisService freeImageAnalysisService;
    private static final int MAX_CONTENT_LENGTH = 65535;
    private static final long MAX_VIDEO_SIZE = 100 * 1024 * 1024;
    @Override
    public Post addPost(Post post) {
        return postRepository.save(post);
    }
    @Override
    public Post addPost(Post post, MultipartFile imageFile, MultipartFile videoFile) throws IOException {


        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = cloudinaryService.uploadFile(imageFile, "posts/images");
            post.setImageUrl(imageUrl);
        }

        // Gestion de la vidéo (avec upload spécifique)
        if (videoFile != null && !videoFile.isEmpty()) {
            validateVideoSize(videoFile);
            String videoUrl = cloudinaryService.uploadVideo(videoFile); // Utilisation de la méthode dédiée
            post.setVideoUrl(videoUrl);
        }
        if (imageFile != null && !imageFile.isEmpty()) {
            String aiDescription = freeImageAnalysisService.generateImageDescription(imageFile);
            String fullContent = aiDescription + "\n" + post.getContent();

            // Troncature intelligente
            if (fullContent.length() > MAX_CONTENT_LENGTH) {
                int keepLength = MAX_CONTENT_LENGTH - 4; // Réserve pour "..."
                int lastSpace = fullContent.lastIndexOf(' ', keepLength);
                fullContent = fullContent.substring(0, (lastSpace > 0) ? lastSpace : keepLength) + "...";
            }

            post.setContent(fullContent);
        }


        return postRepository.save(post);
    }
    private String truncateContent(String content) {
        if (content.length() > MAX_CONTENT_LENGTH) {
            int keepLength = MAX_CONTENT_LENGTH - 4;
            int lastSpace = content.lastIndexOf(' ', keepLength);
            return content.substring(0, (lastSpace > 0) ? lastSpace : keepLength) + "...";
        }
        return content;
    }

    private void validateVideoSize(MultipartFile videoFile) throws IOException {
        if (videoFile.getSize() > MAX_VIDEO_SIZE) {
            throw new IOException(
                    String.format("La vidéo dépasse la taille maximale de %dMB",
                            MAX_VIDEO_SIZE/1024/1024)
            );
        }
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

    @Transactional
    @Override
    public List<Post> retrieveAllPosts() {
        return postRepository.findAll();
    }


    @Transactional
    @Override
    public Post retrievePost(Long id) {
        return postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post not found!"));
    }
}
