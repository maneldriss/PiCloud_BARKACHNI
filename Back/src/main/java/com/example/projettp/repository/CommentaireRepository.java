package com.example.projettp.repository;

import com.example.projettp.entities.Commentaire;
import com.example.projettp.entities.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentaireRepository  extends JpaRepository<Commentaire, Long> {
    List<Commentaire> findByPostIdPost(Long postId);

}
