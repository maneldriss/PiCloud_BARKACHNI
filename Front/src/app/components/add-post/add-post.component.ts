import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from 'src/app/services/post.service';


@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent {
  newPost = {
    title: '',
    content: ''
  };

  selectedImage: File | null = null;
  selectedVideo: File | null = null;

  constructor(private postService: PostService, private router: Router)  {}

  onImageSelected(event: any) {
    this.selectedImage = event.target.files[0];
  }

  onVideoSelected(event: any) {
    this.selectedVideo = event.target.files[0];
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('title', this.newPost.title);
    formData.append('content', this.newPost.content);
    if (this.selectedImage) {
      formData.append('imageFile', this.selectedImage);
    }
    if (this.selectedVideo) {
      formData.append('videoFile', this.selectedVideo);
    }

    const userId = 1; // ou récupéré dynamiquement

    this.postService.addPostWithFiles(userId, formData).subscribe({
      next: (response) => {
        console.log('Post ajouté avec succès:', response);
        this.router.navigate(['/post']); // ⬅️ Redirection vers la liste
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout du post:', error);
      }
    });
    
  }

}
