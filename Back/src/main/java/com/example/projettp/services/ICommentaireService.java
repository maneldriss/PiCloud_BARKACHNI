package com.example.projettp.services;

import com.example.projettp.entities.Commentaire;

import java.util.List;

public interface ICommentaireService {
    Commentaire addCommentaire(Commentaire commentaire);
    Commentaire updateCommentaire(Commentaire commentaire);
    void deleteCommentaire(Long id);
    List<Commentaire> retrieveAllCommentaires();
    Commentaire retrieveCommentaire(Long id);
}
