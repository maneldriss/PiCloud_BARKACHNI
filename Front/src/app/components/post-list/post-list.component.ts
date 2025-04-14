
import { PostService } from 'src/app/services/post.service';
import { Post } from 'src/app/models/post';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

  posts: Post[] = [];
  editMode: boolean = false;
  selectedPost: Post = {
    idPost: 0,
    title: '',
    content: '',
    user: {
      idUser: 1,
      username: '',
      email: ''
    }  // ou adapte avec utilisateur actuel
  };
  editPostId: number | null = null;
editedPost: Post = {
  idPost: 0,
  title: '',
  content: '',
  user: {
    idUser: 1,
    username: '',
    email: ''
  }
};
  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.getAllPosts();
  }

  showAddForm: boolean = false;

togglePostForm(): void {
  this.showAddForm = !this.showAddForm;
}

onPostAdded(newPost: Post): void {
  this.posts.unshift(newPost); // ajoute en haut
  this.showAddForm = false;    // cache le formulaire
}



  getAllPosts(): void {
    this.postService.getAllPosts().subscribe({
      next: (data) => {
        console.log('Données reçues :', data);  // Vérifie ce que tu reçois
        this.posts = data;
      },
      error: (err) => {
        console.error('Erreur de récupération des posts', err);
      }
    });
  }
  
  
  onDeletePost(postId: number | undefined): void {
    if (!postId) {
      console.error('L\'ID du post est invalide ou non défini');
      return;
    }
    
    console.log('ID du post à supprimer:', postId);
    
    this.postService.deletePost(postId).subscribe({
      next: () => {
        console.log('Post supprimé avec succès');
        this.posts = this.posts.filter(post => post.idPost !== postId);
      },
      error: (err) => {
        console.error('Erreur lors de la suppression du post', err);
      }
    });

    
  }
  
  onEditPost(post: Post): void {
    this.editMode = true;
    this.selectedPost = { ...post }; // Cloner l'objet pour éviter les modifs directes
  }

  /*cancelEdit(): void {
    this.editMode = false;
    this.selectedPost = { idPost: 0, title: '', content: '', user: {
      idUser: 1,
      username: '',
      email: ''
    } };
  }*/

  updatePost(): void {
    const userId = this.selectedPost.user?.idUser || 1;
    this.postService.updatePost(userId, this.selectedPost).subscribe(updated => {
      this.getAllPosts(); // rafraîchir la liste
      this.cancelEdit();
    });
  
  }
  startEditing(post: Post): void {
    this.editPostId = post.idPost;
    this.editedPost = { ...post }; // Clone du post sélectionné
  }
  
  cancelEdit(): void {
    this.editPostId = null;
    this.editedPost = {
      idPost: 0,
      title: '',
      content: '',
      user: {
        idUser: 1,
        username: '',
        email: ''
      }
    };
  }
  
  saveEdit(): void {
    const title = this.editedPost.title.trim();
    const content = this.editedPost.content.trim();
  
    if (title.length < 3 || content.length < 5) {
      alert("Le titre doit contenir au moins 3 caractères et le contenu au moins 5 caractères.");
      return;
    }
  
    const userId = this.editedPost.user?.idUser || 1;
    this.postService.updatePost(userId, this.editedPost).subscribe(() => {
      this.getAllPosts();
      this.cancelEdit();
    });
  }
  
  
}
