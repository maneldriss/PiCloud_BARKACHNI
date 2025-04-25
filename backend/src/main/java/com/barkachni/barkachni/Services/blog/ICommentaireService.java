package com.barkachni.barkachni.Services.blog;



import com.barkachni.barkachni.entities.blog.Commentaire;

import java.util.List;

public interface ICommentaireService {
    Commentaire addCommentaire(Commentaire commentaire);
    Commentaire updateCommentaire(Commentaire commentaire);
    void deleteCommentaire(Long id);
    List<Commentaire> retrieveAllCommentaires();
    Commentaire retrieveCommentaire(Long id);
}
