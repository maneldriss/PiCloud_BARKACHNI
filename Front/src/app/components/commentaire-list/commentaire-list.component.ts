import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Commentaire } from 'src/app/models/commentaire';
import { Post } from 'src/app/models/post';
import { User } from 'src/app/models/user';
import { CommentaireService } from 'src/app/services/commentaire.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-commentaire-list',
  templateUrl: './commentaire-list.component.html',
  styleUrls: ['./commentaire-list.component.css']
})
export class CommentaireListComponent  implements OnInit {

  postId!: number;
  post!: Post;
  commentaires: Commentaire[] = [];
  newCommentContent: string = '';
  isCommentFormVisible: boolean = false;
  currentUser: User = {
    idUser: 1, // À remplacer par l'ID réel de l'utilisateur connecté
    username: 'Utilisateur Actuel',
    email: ''
  };
  

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private commentaireService: CommentaireService
  ) {}

  ngOnInit(): void {
    this.postId = Number(this.route.snapshot.paramMap.get('id'));
    
    this.postService.getPostById(this.postId).subscribe(
      (data) => this.post = data
    );

    this.commentaireService.getCommentairesByPost(this.postId).subscribe(
      (data) => this.commentaires = data
    );
  }
    // Afficher ou masquer le formulaire d'ajout de commentaire
   

 
    toggleCommentForm(): void {
      this.isCommentFormVisible = !this.isCommentFormVisible;
      if (!this.isCommentFormVisible) {
        this.newCommentContent = '';
      }
    }
  
    // Ajouter un commentaire
    loadPost(): void {
      this.postService.getPostById(this.postId).subscribe(
        (data) => this.post = data
      );
    }
  
    loadComments(): void {
      this.commentaireService.getCommentairesByPost(this.postId).subscribe(
        (data) => this.commentaires = data
      );
    }
  
  
    addComment(): void {
      if (!this.newCommentContent.trim()) return;
    
      this.commentaireService.addCommentaire(this.postId, { 
        content: this.newCommentContent 
      }).subscribe({
        next: (comment) => {
          this.commentaires.unshift(comment);
          this.newCommentContent = '';
          this.isCommentFormVisible = false;
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout du commentaire', err);
        }
      });
    }
    deleteComment(commentId: number): void {
      if (!confirm('Voulez-vous vraiment supprimer ce commentaire ?')) {
        return;
      }
    
      // Trouver l'index du commentaire
      const index = this.commentaires.findIndex(c => c.idCommentaire === commentId);
      
      if (index !== -1) {
        // Ajouter la classe d'animation
        const commentElement = document.querySelector(`[data-comment-id="${commentId}"]`);
        if (commentElement) {
          commentElement.classList.add('deleting');
        }
    
        // Supprimer après l'animation
        setTimeout(() => {
          this.commentaireService.deleteCommentaire(commentId).subscribe({
            next: () => {
              this.commentaires = this.commentaires.filter(c => c.idCommentaire !== commentId);
            },
            error: (err) => {
              console.error('Erreur lors de la suppression', err);
              if (commentElement) {
                commentElement.classList.remove('deleting');
              }
            }
          });
        }, 250);
      }
    }

    startEdit(commentaire: Commentaire): void {
      // Annule toute autre édition en cours
      this.commentaires.forEach(c => {
        if (c.editing) {
          c.editing = false;
          c.updatedContent = c.content;
        }
      });
      
      // Active l'édition pour ce commentaire
      commentaire.editing = true;
      commentaire.updatedContent = commentaire.content;
      
      // Animation et focus
      setTimeout(() => {
        const element = document.querySelector(`[data-comment-id="${commentaire.idCommentaire}"]`);
        if (element) {
          element.classList.add('editing-mode');
          const textarea = element.querySelector('textarea');
          if (textarea) {
            textarea.focus();
          }
        }
      });
    }
    cancelEdit(commentaire: Commentaire): void {
      commentaire.editing = false;
      commentaire.updatedContent = commentaire.content;
      const element = document.querySelector(`[data-comment-id="${commentaire.idCommentaire}"]`);
      if (element) {
        element.classList.remove('editing-mode');
      }
    }
  
    saveEdit(commentaire: Commentaire): void {
      if (!commentaire.updatedContent?.trim()) {
        alert('Le commentaire ne peut pas être vide');
        return;
      }
    
      // Prépare les données à envoyer
      const commentToUpdate = {
        ...commentaire,
        content: commentaire.updatedContent
      };
    
      this.commentaireService.updateCommentaire(commentToUpdate)
        .subscribe({
          next: (updatedComment) => {
            // Met à jour le commentaire localement
            const index = this.commentaires.findIndex(c => c.idCommentaire === updatedComment.idCommentaire);
            if (index !== -1) {
              this.commentaires[index] = {
                ...updatedComment,
                editing: false,
                updatedContent: updatedComment.content
              };
            }
            
            // Retire le mode édition
            const element = document.querySelector(`[data-comment-id="${updatedComment.idCommentaire}"]`);
            if (element) {
              element.classList.remove('editing-mode');
            }
          },
          error: (err) => {
            console.error('Erreur lors de la mise à jour', err);
            // Réinitialise en cas d'erreur
            commentaire.updatedContent = commentaire.content;
          }
        });
    }
}
