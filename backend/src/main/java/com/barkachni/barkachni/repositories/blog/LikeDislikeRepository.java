package com.barkachni.barkachni.repositories.blog;

import com.barkachni.barkachni.entities.blog.LikeDislike;
import com.barkachni.barkachni.entities.blog.Post;
import com.barkachni.barkachni.entities.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface LikeDislikeRepository extends JpaRepository<LikeDislike, Long> {
    Optional<LikeDislike> findByUserAndPost(User user, Post post);
    long countByPostAndLikedTrue(Post post);
    long countByPostAndDislikedTrue(Post post);

    @Query("SELECT ld.user FROM LikeDislike ld WHERE ld.post = :post AND ld.liked = true")
    List<User> findUsersWhoLiked(Post post);

    @Query("SELECT ld.user FROM LikeDislike ld WHERE ld.post = :post AND ld.disliked = true")
    List<User> findUsersWhoDisliked(Post post);

}
