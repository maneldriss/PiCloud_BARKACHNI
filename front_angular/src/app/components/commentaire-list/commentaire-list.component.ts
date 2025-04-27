import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Commentaire } from 'src/app/models/commentaire';
import { Post } from 'src/app/models/post';

import { AuthService } from 'src/app/services/auth/auth.service';
import { CommentaireService } from 'src/app/services/commentaire.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-commentaire-list',
  templateUrl: './commentaire-list.component.html',
  styleUrls: ['./commentaire-list.component.css']
})
export class CommentaireListComponent implements OnInit {
 
  postId!: number;
  post!: Post;
  commentaires: Commentaire[] = [];
  errorMessage: string = '';
  badWordsDetected: string[] = [];
  newCommentContent: string = '';
  isCommentFormVisible: boolean = false;
  userId :number | null = null;
  currentUserId: number |null=null;
  

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private commentaireService: CommentaireService,
     private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log('Initialisation du composant CommentaireListComponent');
    
    this.postId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('ID du post récupéré depuis l\'URL:', this.postId);
    this.getCurrentUserId();
    this.loadPost();
    this.loadComments();
  }
  getCurrentUserId(): void {
    const currentUser = this.authService.getCurrentUser();
    console.log("Current user data:", currentUser);
    this.currentUserId = currentUser?.id ?? null;
    console.log("Fetched user ID:", this.currentUserId); // Corrigé pour logguer currentUserId
}
// Ajoutez ces propriétés à votre classe de composant
showEmojiPicker = false;
currentEmojiTarget = '';
emojiSearch = '';
currentEmojiCategory = 'smileys';

// Définissez plusieurs catégories d'émojis
emojiCategories: Record<string, string[]> = {
  recent: ['😀', '😂', '❤️', '👍', '🎉', '🔥', '✨', '👏'],
  smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳'],
  animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛'],
  food: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🌽', '🥕', '🥔', '🍟', '🍕', '🍔'],
  activities: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🥅', '⛳', '🚴', '🚵', '🤸', '🤼', '🤽', '🏊', '🚣', '🧗'],
  travel: ['✈️', '🚀', '🚁', '🚂', '🚊', '🚉', '🚞', '🚆', '🚄', '🚅', '🚈', '🚇', '🚝', '🚋', '🚌', '🚎', '🚐', '🚑', '🚒', '🚓', '🚕', '🚗', '🚙', '🚚', '🚛', '🚜', '🛴', '🚲']
};
  toggleCommentForm(): void {
    console.log('Changement d\'état du formulaire de commentaire. Ancien état:', this.isCommentFormVisible);
    this.isCommentFormVisible = !this.isCommentFormVisible;
    if (!this.isCommentFormVisible) {
      console.log('Réinitialisation du contenu du commentaire');
      this.newCommentContent = '';
    }
    console.log('Nouvel état du formulaire de commentaire:', this.isCommentFormVisible);
  }

  loadPost(): void {
    console.log('Chargement du post avec ID:', this.postId);
    this.postService.getPostById(this.postId).subscribe(
      (data) => {
        console.log('Post récupéré avec succès:', data);
        this.post = data;
      },
      (error) => {
        console.error('Erreur lors du chargement du post:', error);
      }
    );
  }

  loadComments(): void {
    console.log('Chargement des commentaires pour le post ID:', this.postId);
    this.commentaireService.getCommentairesByPost(this.postId).subscribe(
      (data) => {
        console.log('Commentaires récupérés avec succès:', data);
        this.commentaires = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des commentaires:', error);
      }
    );
  }

  highlightBadWords() {
    console.log('Vérification des mots interdits dans:', this.newCommentContent);
    const badWords = ['putain']; 
    this.badWordsDetected = badWords.filter(word => 
      this.newCommentContent.toLowerCase().includes(word.toLowerCase())
    );
    console.log('Mots interdits détectés:', this.badWordsDetected);
  }

  addComment(): void {
    console.log('Tentative d\'ajout de commentaire. Contenu:', this.newCommentContent);
    
    if (!this.newCommentContent.trim()) {
      console.warn('Le commentaire est vide - annulation');
      return;
    }
    
    this.clearErrors();
    
    if (this.hasBadWords()) {
      console.warn('Commentaire contient des mots interdits - annulation');
      this.showBadWordsError();
      return;
    }
    
    console.log('Envoi du commentaire au serveur...');
    this.commentaireService.addCommentaire(this.postId, {
      content: this.newCommentContent
    }).subscribe({
      next: (comment) => {
        console.log('Commentaire ajouté avec succès:', comment);
        this.handleSuccess(comment);
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout du commentaire:', err);
        this.handleError(err);
      }
    });
  }

  private clearErrors(): void {
    console.log('Nettoyage des erreurs précédentes');
    this.errorMessage = '';
    this.badWordsDetected = [];
  }

  private hasBadWords(): boolean {
    this.highlightBadWords();
    const hasBadWords = this.badWordsDetected.length > 0;
    console.log('Contient des mots interdits:', hasBadWords);
    return hasBadWords;
  }

  private showBadWordsError(): void {
    console.log('Affichage de l\'erreur de mots interdits');
    this.errorMessage = 'Votre commentaire contient des termes inappropriés. Veuillez le reformuler.';
  }

  private handleSuccess(comment: Commentaire): void {
    console.log('Traitement du succès de l\'ajout de commentaire');
    comment.content = this.fixEncodedSpaces(comment.content);
    console.log('Commentaire après correction des espaces:', comment);
    
    this.commentaires.unshift(comment);
    this.resetCommentForm();
    console.log('Commentaire ajouté à la liste. Nouvelle liste:', this.commentaires);
  }

  private fixEncodedSpaces(content: string): string {
    console.log('Vérification des espaces encodés dans:', content);
    return content.includes('%20') ? content.replace(/%20/g, ' ') : content;
  }

  private resetCommentForm(): void {
    console.log('Réinitialisation du formulaire de commentaire');
    this.newCommentContent = '';
    this.isCommentFormVisible = false;
  }

  private handleError(err: any): void {
    console.error('Erreur détectée:', err);
    this.errorMessage = this.getErrorMessage(err);
    console.log('Message d\'erreur affiché à l\'utilisateur:', this.errorMessage);
  }

  private getErrorMessage(err: any): string {
    if (err.status === 400) {
      console.log('Erreur 400 - Contenu inapproprié');
      return err.error || 'Contenu inapproprié détecté';
    }
    console.log('Erreur générique');
    return 'Erreur lors de l\'ajout du commentaire';
  }

  deleteComment(commentId: number): void {
    console.log('Tentative de suppression du commentaire ID:', commentId);
    
    if (!confirm('Voulez-vous vraiment supprimer ce commentaire ?')) {
      console.log('Suppression annulée par l\'utilisateur');
      return;
    }
    
    const index = this.commentaires.findIndex(c => c.idCommentaire === commentId);
    console.log('Index du commentaire à supprimer:', index);
    
    if (index !== -1) {
      const commentElement = document.querySelector(`[data-comment-id="${commentId}"]`);
      if (commentElement) {
        console.log('Ajout de l\'animation de suppression');
        commentElement.classList.add('deleting');
      }

      setTimeout(() => {
        console.log('Suppression effective du commentaire');
        this.commentaireService.deleteCommentaire(commentId).subscribe({
          next: () => {
            console.log('Commentaire supprimé avec succès');
            this.commentaires = this.commentaires.filter(c => c.idCommentaire !== commentId);
            console.log('Nouvelle liste de commentaires:', this.commentaires);
          },
          error: (err) => {
            console.error('Erreur lors de la suppression:', err);
            if (commentElement) {
              console.log('Retrait de l\'animation de suppression');
              commentElement.classList.remove('deleting');
            }
          }
        });
      }, 250);
    }
  }

  startEdit(commentaire: Commentaire): void {
    console.log('Début de l\'édition du commentaire ID:', commentaire.idCommentaire);
    
    this.commentaires.forEach(c => {
      if (c.editing) {
        console.log('Annulation de l\'édition en cours pour le commentaire ID:', c.idCommentaire);
        c.editing = false;
        c.updatedContent = c.content;
      }
    });
    
    commentaire.editing = true;
    commentaire.updatedContent = commentaire.content;
    console.log('Mode édition activé pour le commentaire:', commentaire);
    
    setTimeout(() => {
      const element = document.querySelector(`[data-comment-id="${commentaire.idCommentaire}"]`);
      if (element) {
        console.log('Ajout de la classe editing-mode');
        element.classList.add('editing-mode');
        const textarea = element.querySelector('textarea');
        if (textarea) {
          console.log('Focus sur le textarea d\'édition');
          textarea.focus();
        }
      }
    });
  }

  cancelEdit(commentaire: Commentaire): void {
    console.log('Annulation de l\'édition du commentaire ID:', commentaire.idCommentaire);
    commentaire.editing = false;
    commentaire.updatedContent = commentaire.content;
    
    const element = document.querySelector(`[data-comment-id="${commentaire.idCommentaire}"]`);
    if (element) {
      console.log('Retrait de la classe editing-mode');
      element.classList.remove('editing-mode');
    }
  }

  saveEdit(commentaire: Commentaire): void {
    console.log('Tentative de sauvegarde du commentaire ID:', commentaire.idCommentaire);
    
    if (!commentaire.updatedContent?.trim()) {
      console.warn('Le commentaire est vide - annulation');
      alert('Le commentaire ne peut pas être vide');
      return;
    }
    
    const commentToUpdate = {
      ...commentaire,
      content: commentaire.updatedContent
    };
    console.log('Données à envoyer pour mise à jour:', commentToUpdate);
    
    this.commentaireService.updateCommentaire(commentToUpdate).subscribe({
      next: (updatedComment) => {
        console.log('Commentaire mis à jour avec succès:', updatedComment);
        const index = this.commentaires.findIndex(c => c.idCommentaire === updatedComment.idCommentaire);
        
        if (index !== -1) {
          this.commentaires[index] = {
            ...updatedComment,
            editing: false,
            updatedContent: updatedComment.content
          };
          console.log('Liste de commentaires mise à jour:', this.commentaires);
        }
        
        const element = document.querySelector(`[data-comment-id="${updatedComment.idCommentaire}"]`);
        if (element) {
          console.log('Retrait de la classe editing-mode');
          element.classList.remove('editing-mode');
        }
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour:', err);
        console.log('Restauration du contenu original');
        commentaire.updatedContent = commentaire.content;
      }
    });
  }
  

 
// Récupérer les émojis selon la catégorie sélectionnée et la recherche
get filteredEmojis(): string[] {
  const emojis = (this.emojiCategories as Record<string, string[]>)[this.currentEmojiCategory] || this.emojiCategories['smileys'];
  
  if (!this.emojiSearch.trim()) {
    return emojis;
  }
  
  return emojis.filter((emoji: string) => 
    this.emojiToDescription(emoji).toLowerCase().includes(this.emojiSearch.toLowerCase())
  );
}

// Convertir l'emoji en description pour la recherche (simplifiée)

emojiToDescription(emoji: string): string {
  const descriptions: Record<string, string> = {
    '😀': 'sourire heureux',
    '😃': 'sourire grand ouvert',
    '😄': 'sourire yeux',
    '😁': 'sourire grimace',
    '😆': 'sourire ferme',
    '😅': 'sueur sourire',
    '😂': 'rire larmes',
    '🤣': 'roulant rire',
    '😘' : 'bisous',
    // Ajoutez d'autres descriptions selon vos besoins
  };
  
  return descriptions[emoji] || emoji;
}
// Méthode pour définir la catégorie d'émojis active
setEmojiCategory(category: string) {
  this.currentEmojiCategory = category;
}

// Méthode pour basculer l'affichage du sélecteur d'emoji
toggleEmojiPicker(target: string) {
  if (this.showEmojiPicker && this.currentEmojiTarget === target) {
    this.showEmojiPicker = false;
  } else {
    this.showEmojiPicker = true;
    this.currentEmojiTarget = target;
    this.emojiSearch = '';
    this.currentEmojiCategory = 'smileys'; // Réinitialiser la catégorie
  }
}

// Méthode pour ajouter un emoji au textarea approprié
addEmoji(emoji: string, target: string) {
  if (target === 'comment') {
    // Pour le nouveau commentaire
    this.newCommentContent = this.newCommentContent || '';
    this.newCommentContent += emoji;
  } else if (target.startsWith('edit-')) {
    // Pour l'édition d'un commentaire existant
    const commentId = parseInt(target.replace('edit-', ''));
    const commentaire = this.commentaires.find(c => c.idCommentaire === commentId);
    if (commentaire) {
      commentaire.updatedContent = (commentaire.updatedContent || commentaire.content) + emoji;
    }
  }
}

// Méthode pour fermer le sélecteur d'émojis en cliquant ailleurs
@HostListener('document:click', ['$event'])
clickOutside(event: any) {
  const emojiPickerElements = document.querySelectorAll('.emoji-picker, .btn-emoji');
  let clickedInsidePicker = false;
  
  emojiPickerElements.forEach(element => {
    if (element.contains(event.target)) {
      clickedInsidePicker = true;
    }
  });
  
  if (!clickedInsidePicker && this.showEmojiPicker) {
    this.showEmojiPicker = false;
  }
}
  
}