package com.barkachni.barkachni.repositories.blog;


import com.barkachni.barkachni.entities.blog.Commentaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentaireRepository  extends JpaRepository<Commentaire, Long> {
    List<Commentaire> findByPostIdPost(Long postId);

}
