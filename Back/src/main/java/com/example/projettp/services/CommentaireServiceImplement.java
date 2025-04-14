package com.example.projettp.services;

import com.example.projettp.entities.Commentaire;
import com.example.projettp.repository.CommentaireRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentaireServiceImplement implements ICommentaireService {

    @Autowired
    private CommentaireRepository commentaireRepository;

    @Override
    public Commentaire addCommentaire(Commentaire commentaire) {
        return commentaireRepository.save(commentaire);
    }

    @Override
    public Commentaire updateCommentaire(Commentaire commentaire) {
        if (commentaireRepository.existsById(commentaire.getIdCommentaire())) {
            return commentaireRepository.save(commentaire);
        }
        throw new RuntimeException("Commentaire not found!");
    }

    @Override
    public void deleteCommentaire(Long id) {
        if (commentaireRepository.existsById(id)) {
            commentaireRepository.deleteById(id);
        } else {
            throw new RuntimeException("Commentaire not found!");
        }
    }

    @Override
    public List<Commentaire> retrieveAllCommentaires() {
        return commentaireRepository.findAll();
    }

    @Override
    public Commentaire retrieveCommentaire(Long id) {
        return commentaireRepository.findById(id).orElseThrow(() -> new RuntimeException("Commentaire not found!"));
    }

}
