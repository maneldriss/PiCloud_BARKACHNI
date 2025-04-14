
import { PostService } from 'src/app/services/post.service';
import { Post } from 'src/app/models/post';
import { Component, OnInit } from '@angular/core';
import { LikeDislikeService } from 'src/app/services/like-dislike.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

  posts: Post[] = [];
  userId: number = 1; 

  // Pagination
currentPage = 1;
itemsPerPage = 5;
searchQuery: string = '';
searchTerm: string = '';


  likedUsers: {[postId: number]: string[]} = {};
  dislikedUsers: {[postId: number]: string[]} = {};
  hoveredPostId: number | null = null;
  hoverType: 'like' | 'dislike' | null = null;


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
  constructor(private postService: PostService, private likeService: LikeDislikeService) {}

  ngOnInit(): void {
    this.getAllPosts();
    this.loadLikes();  
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
      console.log('Données reçues :', data);
      
      // Tri des posts par date décroissante (plus récent en premier)
      this.posts = data.sort((a, b) => 
        new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
      );
      
      this.loadLikes();  // Charge les likes après avoir récupéré les posts
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
  /*************like  */
  loadPosts() {
    this.postService.getAllPosts().subscribe((data: Post[]) => {
      this.posts = data;
      this.posts.forEach(post => {
        this.likeService.getCounts(post.idPost).subscribe(counts => {
          post.likeCount = counts.likes;
          post.dislikeCount = counts.dislikes;
        });
      });
    });
  }
  like(postId: number): void {
    this.likeService.likePost(this.userId, postId).subscribe(() => {
      this.loadLikes();  // Recharge les likes après un like
      this.loadLikedUsers(postId);  // Recharge les utilisateurs qui ont aimé
    });
  }
  
 dislike(postId: number): void {
    this.likeService.dislikePost(this.userId, postId).subscribe(() => {
      this.loadLikes();  // Recharge les likes après un dislike
      this.loadDislikedUsers(postId);  // Recharge les utilisateurs qui ont disliké
    });
  }
  
  loadLikes() {
    this.posts.forEach(post => {
      this.likeService.getCounts(post.idPost).subscribe(counts => {
        post.likeCount = counts.likes;
        post.dislikeCount = counts.dislikes;
      });
    });
  }
  /***mouse */
    // Méthodes pour gérer le survol
  onMouseEnterLike(postId: number): void {
    this.hoveredPostId = postId;
    this.hoverType = 'like';
    this.loadLikedUsers(postId);
  }

  onMouseEnterDislike(postId: number): void {
    this.hoveredPostId = postId;
    this.hoverType = 'dislike';
    this.loadDislikedUsers(postId);
  }

  onMouseLeave(): void {
    this.hoveredPostId = null;
    this.hoverType = null;
  }

  loadLikedUsers(postId: number): void {
    if (!this.likedUsers[postId]) {
      this.likeService.getUsersWhoLiked(postId).subscribe(users => {
        this.likedUsers[postId] = users;
      });
    }
  }

  loadDislikedUsers(postId: number): void {
    if (!this.dislikedUsers[postId]) {
      this.likeService.getUsersWhoDisliked(postId).subscribe(users => {
        this.dislikedUsers[postId] = users;
      });
    }
  }
  //pagination
  getMinValue(a: number, b: number): number {
    return Math.min(a, b);
  }
  get filteredPosts(): Post[] {
    return this.posts.filter(post =>
      post.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  
  get totalPages(): number {
    return Math.ceil(this.filteredPosts.length / this.itemsPerPage);
  }
  
  
 
  get paginatedPosts(): Post[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredPosts.slice(start, end);
  }
  
  
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
  
  goToPage(page: number): void {
    this.currentPage = page;
  }
  
  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
