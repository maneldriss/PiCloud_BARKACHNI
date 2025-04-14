package com.example.projettp.repository;

import com.example.projettp.entities.LikeDislike;
import com.example.projettp.entities.Post;
import com.example.projettp.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LikeDislikeRepository extends JpaRepository<LikeDislike, Long> {
    Optional<LikeDislike> findByUserAndPost(User user, Post post);

}
