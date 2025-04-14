package com.example.projettp.controllers;


import com.example.projettp.entities.Commentaire;
import com.example.projettp.entities.Post;
import com.example.projettp.entities.User;
import com.example.projettp.repository.CommentaireRepository;
import com.example.projettp.repository.PostRepository;
import com.example.projettp.repository.UserRepository;
import com.example.projettp.services.ICommentaireService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/commentaires")
public class CommentaireController {
    @Autowired
    private PostRepository postRepository;
    @Autowired
    private CommentaireRepository commentaireRepository;
    @Autowired
    private UserRepository userRepository;
    private final ICommentaireService commentaireService;

    public CommentaireController(ICommentaireService commentaireService) {
        this.commentaireService = commentaireService;
    }

    @PostMapping("/{postId}/commentaires")
    public ResponseEntity<Commentaire> addCommentaireToPost(
            @PathVariable Long postId,
            @RequestBody Commentaire commentaire) {

        // 1. Récupérer le post
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with id " + postId));

        // 2. Utiliser l'utilisateur par défaut (ID=1) au lieu de celui dans le commentaire
        User defaultUser = userRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("Default user not found"));

        // 3. Créer un nouveau commentaire et définir les relations
        Commentaire newCommentaire = new Commentaire();
        newCommentaire.setContent(commentaire.getContent());
        newCommentaire.setPost(post);
        newCommentaire.setUser(defaultUser);

        // 4. Sauvegarder
        Commentaire savedCommentaire = commentaireRepository.save(newCommentaire);

        return ResponseEntity.ok(savedCommentaire);
    }


    @PutMapping("/{id}")
    public ResponseEntity<Commentaire> updateCommentaire(
            @PathVariable Long id,
            @RequestBody Commentaire commentaire) {

        // 1. Récupérer le commentaire existant
        Commentaire existingComment = commentaireRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commentaire not found with id " + id));

        // 2. Mettre à jour uniquement le contenu (ne pas modifier les relations)
        existingComment.setContent(commentaire.getContent());

        // 3. Sauvegarder
        Commentaire updatedComment = commentaireRepository.save(existingComment);

        return ResponseEntity.ok(updatedComment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCommentaire(@PathVariable Long id) {
        commentaireService.deleteCommentaire(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<Commentaire>> getAllCommentaires() {
        List<Commentaire> commentaires = commentaireService.retrieveAllCommentaires();
        return ResponseEntity.ok(commentaires);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Commentaire> getCommentaireById(@PathVariable Long id) {
        Commentaire commentaire = commentaireService.retrieveCommentaire(id);
        return ResponseEntity.ok(commentaire);
    }
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Commentaire>> getCommentairesByPost(@PathVariable Long postId) {
        List<Commentaire> commentaires = commentaireRepository.findByPostIdPost(postId);
        return ResponseEntity.ok(commentaires);
    }

}
