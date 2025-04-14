package com.example.projettp.controllers;


import com.example.projettp.entities.Commentaire;
import com.example.projettp.entities.Post;
import com.example.projettp.entities.User;
import com.example.projettp.repository.CommentaireRepository;
import com.example.projettp.repository.PostRepository;
import com.example.projettp.repository.UserRepository;
import com.example.projettp.services.EmailService;
import com.example.projettp.services.ICommentaireService;
import com.example.projettp.services.PurgoMalumFilterService;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;


import java.util.List;


@RestController
@RequestMapping("/commentaires")
public class CommentaireController {

    private static final Logger logger = LoggerFactory.getLogger(CommentaireController.class);
    @Autowired
    private PostRepository postRepository;
    @Autowired
    private CommentaireRepository commentaireRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PurgoMalumFilterService purgoMalumFilterService;
    @Autowired
    private EmailService emailService;
    private final ICommentaireService commentaireService;

    public CommentaireController(ICommentaireService commentaireService) {
        this.commentaireService = commentaireService;
    }


    @PostMapping("/{postId}/commentaires")
    public ResponseEntity<?> addCommentaireToPost(
            @PathVariable Long postId,
            @RequestBody Commentaire commentaire) {

        // 1. Supprimer le décodage manuel (Spring le gère automatiquement)
        String content = commentaire.getContent();

        // 2. Utilisation de l'utilisateur par défaut
        User defaultUser = userRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("Utilisateur par défaut non trouvé"));

        // 3. Vérification des mots interdits
        if (purgoMalumFilterService.containsBadWords(content)) {
            return ResponseEntity.badRequest()
                    .body("Le commentaire contient des mots inappropriés");
        }

        // 4. Filtrage des mots interdits
        String filteredContent = purgoMalumFilterService.filter(content);

        // 5. Récupération du post
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post non trouvé"));

        // 6. Création et sauvegarde du commentaire
        Commentaire newCommentaire = new Commentaire();
        newCommentaire.setContent(filteredContent);
        newCommentaire.setPost(post);
        newCommentaire.setUser(defaultUser);

        Commentaire savedCommentaire = commentaireRepository.save(newCommentaire);

        // 7. Envoi d'email (avec gestion d'erreur)
        try {
            User postAuthor = savedCommentaire.getPost().getUser();
            emailService.sendCommentNotification(
                    postAuthor.getEmail(),
                    savedCommentaire.getPost().getTitle(),
                    savedCommentaire.getContent(),
                    defaultUser.getUsername(),
                    savedCommentaire.getCreatedAt()
            );
        } catch (Exception e) {
            logger.error("Erreur lors de l'envoi de l'email", e);
            // On continue même si l'email échoue
        }

        return ResponseEntity.ok(savedCommentaire);
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> updateCommentaire(
            @PathVariable Long id,
            @RequestBody Commentaire commentaire) {

        // 0. Vérification et filtrage des mots interdits
        if (purgoMalumFilterService.containsBadWords(commentaire.getContent())) {
            return ResponseEntity.badRequest()
                    .body("Le commentaire contient des mots inappropriés");
        }

        String filteredContent = purgoMalumFilterService.filter(commentaire.getContent());

        // 1. Récupérer le commentaire existant
        Commentaire existingComment = commentaireRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commentaire not found with id " + id));

        // 2. Mettre à jour uniquement le contenu (ne pas modifier les relations)
        existingComment.setContent(filteredContent); // Utiliser le contenu filtré

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
