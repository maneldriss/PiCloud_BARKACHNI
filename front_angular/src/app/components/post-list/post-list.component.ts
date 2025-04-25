import { Component, OnInit } from '@angular/core';

import { LikeDislikeService } from 'src/app/services/like-dislike.service';
import { Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

  posts: Post[] = [];
  topLikedPosts: Post[] = [];
 
  likedUsers: { [postId: number]: string[] } = {};
  dislikedUsers: { [postId: number]: string[] } = {};

  hoveredPostId: number | null = null;
  hoverType: 'like' | 'dislike' | null = null;

  userId: number = 1;
  currentUserId: number |null=null;
  // Pagination
  currentPage = 1;
  itemsPerPage = 4;
  searchTerm: string = '';
  selectedFilter: string = 'date';

  // Form and Edit
  showAddForm = false;
  editPostId: number | null = null;
  editedPost: Post = this.createEmptyPost();

  constructor(private postService: PostService, private likeService: LikeDislikeService,    private authService: AuthService) {}
  getCurrentUserId(): void {
    const currentUser = this.authService.getCurrentUser();
    console.log("Current user data:", currentUser);
    this.currentUserId= currentUser?.id ?? null;
    console.log("Fetched user ID:", this.userId);
  }
  ngOnInit(): void {
    this.getCurrentUserId();
    this.getAllPosts();
  
  }

  togglePostForm(): void {
    this.showAddForm = !this.showAddForm;
  }

  onPostAdded(newPost: Post): void {
 
   
    this.posts.unshift(newPost);
    this.updateTopLikedPosts();
    this.showAddForm = false;
  }

  createEmptyPost(): Post {
    return {
      idPost: 0,
      title: '',
      content: '',
      user: {
        firstname: '',
        lastname: '',
        accountLocked: false,
        enabled: false,
        roles: [],
        currentlyOnline: false,
        lastConnection: '',
        latitude: 0,
        longitude: 0,
        email: '',
        id: 0
      }
    };
  }

  getAllPosts(): void {
    this.postService.getAllPosts().subscribe({
      next: (data) => {
        this.posts = data.sort((a, b) =>
          new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
        );
        console.log('Post structure:', this.posts.map(post => ({
          idPost: post.idPost,
          user: post.user
        })));
        this.applyFilter();
        this.loadLikes();
        this.updateTopLikedPosts();
        this.printPaginationInfo();
      },
      error: (err) => {
        console.error('Erreur de récupération des posts :', err);
      }
    });
    

  }

  applyFilter(): void {
    if (this.selectedFilter === 'date') {
      this.posts.sort((a, b) =>
        new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
      );
    } else if (this.selectedFilter === 'likes') {
      this.posts.sort((a, b) =>
        (b.likeCount || 0) - (a.likeCount || 0)
      );
    }
    this.currentPage = 1;
  }

  updateTopLikedPosts(): void {
    this.topLikedPosts = this.posts
      .filter(p => (p.likeCount ?? 0) > 0)
      .sort((a, b) => (b.likeCount ?? 0) - (a.likeCount ?? 0))
      .slice(0, 4);
  }

  onDeletePost(postId?: number): void {
    if (!postId) return;

    this.postService.deletePost(postId).subscribe({
      next: () => {
        this.posts = this.posts.filter(post => post.idPost !== postId);
        this.updateTopLikedPosts();
      },
      error: (err) => console.error('Erreur lors de la suppression :', err)
    });
  }

  startEditing(post: Post): void {
    this.editPostId = post.idPost;
    this.editedPost = { ...post };
  }

  cancelEdit(): void {
    this.editPostId = null;
    this.editedPost = this.createEmptyPost();
  }

  saveEdit(): void {
    const title = this.editedPost.title.trim();
    const content = this.editedPost.content.trim();

    if (title.length < 3 || content.length < 5) {
      alert("Le titre doit contenir au moins 3 caractères et le contenu au moins 5 caractères.");
      return;
    }

    const userId = this.editedPost.user?.id || 1;
    this.postService.updatePost(userId, this.editedPost).subscribe(() => {
      this.getAllPosts();
      this.cancelEdit();
    });
  }

  // Like/Dislike
  like(postId: number): void {
    this.likeService.likePost(this.userId, postId).subscribe(() => {
      this.refreshPost(postId);
    });
  }

  dislike(postId: number): void {
    this.likeService.dislikePost(this.userId, postId).subscribe(() => {
      this.refreshPost(postId);
    });
  }

  refreshPost(postId: number): void {
    this.loadLikes();
    this.loadLikedUsers(postId);
    this.loadDislikedUsers(postId);
    this.updateTopLikedPosts();
  }

  loadLikes(): void {
    this.posts.forEach(post => {
      this.likeService.getCounts(post.idPost).subscribe(counts => {
        post.likeCount = counts.likes;
        post.dislikeCount = counts.dislikes;
      });
    });
  }

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

  // Pagination logic
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
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  printPaginationInfo(): void {
    console.log('--- Pagination Info ---');
    console.log('Total posts:', this.posts.length);
    console.log('Filtered posts:', this.filteredPosts.length);
    console.log('Current page:', this.currentPage);
    console.log('Total pages:', this.totalPages);
    console.log('Items per page:', this.itemsPerPage);
    console.log('------------------------');
  }
  getMinValue(a: number, b: number): number {
    return Math.min(a, b);
  }
  toggleVideo(post: any) {
    const video = document.getElementById(`video-${post.idPost}`) as HTMLVideoElement;
    if (!post.isPlaying) {
      video.play();
    } else {
      video.pause();
    }
    post.isPlaying = !post.isPlaying;
  }

  setVolume(post: any) {
    const video = document.getElementById(`video-${post.idPost}`) as HTMLVideoElement;
    video.volume = post.volume;
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}
