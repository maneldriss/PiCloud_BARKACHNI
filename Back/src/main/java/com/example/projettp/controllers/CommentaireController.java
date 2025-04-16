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
import java.util.Map;


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

        try {
            // 1. Récupération et décodage du contenu
            String content = commentaire.getContent();
            logger.info("Contenu reçu brut: {}", content);

            // 2. Récupération de l'utilisateur
            User defaultUser = userRepository.findById(1L)
                    .orElseThrow(() -> new RuntimeException("Utilisateur par défaut non trouvé"));

            // 3. Vérification des mots interdits
            if (purgoMalumFilterService.containsBadWords(content)) {
                logger.warn("Commentaire rejeté - contenu inapproprié détecté");
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
            logger.info("Commentaire sauvegardé avec ID: {}", savedCommentaire.getIdCommentaire());

            // 7. Envoi d'email
            try {
                User postAuthor = savedCommentaire.getPost().getUser();
                emailService.sendCommentNotification(
                        postAuthor.getEmail(),
                        savedCommentaire.getPost().getTitle(),
                        savedCommentaire.getContent(),
                        defaultUser.getUsername(),
                        savedCommentaire.getCreatedAt()
                );
                logger.info("Email de notification envoyé à {}", postAuthor.getEmail());
            } catch (Exception e) {
                logger.error("Erreur lors de l'envoi de l'email", e);
            }

            // 8. Retour de la réponse avec contenu décodé
            savedCommentaire.setContent(URLDecoder.decode(savedCommentaire.getContent(), StandardCharsets.UTF_8));
            return ResponseEntity.ok(savedCommentaire);

        } catch (Exception e) {
            logger.error("Erreur lors de l'ajout du commentaire", e);
            return ResponseEntity.internalServerError()
                    .body("Une erreur est survenue lors de l'ajout du commentaire");
        }
    }



    @PutMapping("/{id}")
    public ResponseEntity<?> updateCommentaire(
            @PathVariable Long id,
            @RequestBody Map<String, String> requestBody) {

        try {
            // 0. Récupération du contenu
            String content = requestBody.get("content");
            logger.info("Contenu reçu pour mise à jour: {}", content);

            // 1. Vérification des mots interdits
            if (purgoMalumFilterService.containsBadWords(content)) {
                logger.warn("Mise à jour rejetée - contenu inapproprié détecté");
                return ResponseEntity.badRequest()
                        .body("Le commentaire contient des mots inappropriés");
            }

            // 2. Filtrage des mots interdits
            String filteredContent = purgoMalumFilterService.filter(content);

            // 3. Récupérer le commentaire existant
            Commentaire existingComment = commentaireRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Commentaire non trouvé avec l'id " + id));

            // 4. Mettre à jour le contenu
            existingComment.setContent(filteredContent);

            // 5. Sauvegarder
            Commentaire updatedComment = commentaireRepository.save(existingComment);
            logger.info("Commentaire mis à jour avec ID: {}", updatedComment.getIdCommentaire());

            // 6. Décoder le contenu avant retour
            updatedComment.setContent(URLDecoder.decode(updatedComment.getContent(), StandardCharsets.UTF_8));

            return ResponseEntity.ok(updatedComment);

        } catch (Exception e) {
            logger.error("Erreur lors de la mise à jour du commentaire", e);
            return ResponseEntity.internalServerError()
                    .body("Une erreur est survenue lors de la mise à jour du commentaire");
        }
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
