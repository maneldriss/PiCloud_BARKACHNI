import { Component } from '@angular/core';
import { Post } from 'src/app/models/post';
import { Router } from '@angular/router';
import { PostService } from 'src/app/services/post.service';



@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent {

  
    newPost: Post = {
      title: '',
      content: '',
      imageUrl: '',
      videoUrl: '',
      idPost: 0
    };

  aiGeneratedContent: string = ''; 
  isGenerating = false;

  allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
  allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];

  maxImageSize = 5 * 1024 * 1024; // 5 MB
  maxVideoSize = 50 * 1024 * 1024;

  constructor(private postService: PostService, private router: Router) {}

  imageFile: File | null = null;
videoFile: File | null = null;



imageError: string = '';
videoError: string = '';

onImageSelected(event: any): void {
  const file = event.target.files[0];

  if (file && !this.allowedImageTypes.includes(file.type)) {
    alert("Type de fichier image non valide. Seuls JPG, PNG et GIF sont acceptés.");
    event.target.value = ''; // Réinitialiser le champ file
    this.imageFile = null;
    return;
  }

  if (file && file.size > this.maxImageSize) {
    alert("Image trop volumineuse. Taille max: 5 Mo.");
    event.target.value = '';
    this.imageFile = null;
    return;
  }

  if (file) {
    this.imageFile = file;
    this.generateDescription(file);
  }
}




generateDescription(file: File) {
  this.isGenerating = true;
  console.log('Début de la génération AI...');
  
  this.postService.generateAIDescription(file).subscribe({
    next: (description) => {
      console.log('Réponse brute de l\'IA:', description);
      
      const cleanedDescription = this.cleanAIDuplicates(description);
      console.log('Réponse nettoyée:', cleanedDescription);
      
      this.aiGeneratedContent = cleanedDescription;
      this.isGenerating = false;
    },
    error: (err) => {
      console.error('Erreur complète:', err);
      console.log('Détails de l\'erreur:', err.error);
      this.isGenerating = false;
      alert('Erreur : ' + (err.error?.details || err.message));
    }
  });
}

private cleanAIDuplicates(text: string): string {
  console.log('Nettoyage du texte:', text);
  return text.replace(/\[IA\]|Collection Printemps-Été 2025 :|�/gi, '')
  .replace(/(\s{2,})/g, ' ')
  .trim();
}
useAIContent() {
  this.newPost.content = this.aiGeneratedContent;
}

clearAIContent() {
  this.aiGeneratedContent = '';
}

onVideoSelected(event: any): void {
  const file = event.target.files[0];
  this.videoError = '';

  if (file) {
    if (!this.allowedVideoTypes.includes(file.type)) {
      this.videoError = 'Format vidéo invalide (MP4, WebM, OGG uniquement).';
      this.videoFile = null;
      return;
    }
   
    this.videoFile = file;
  }
}

onSubmit(): void {
  const formData = new FormData();

  const postData = {
    title: this.newPost.title,
    content: this.newPost.content,
    imageUrl: '',
    videoUrl: ''
  };

  formData.append('post', new Blob([JSON.stringify(postData)], { type: 'application/json' }));

  if (this.imageFile) {
    formData.append('imageFile', this.imageFile);
  }

  if (this.videoFile) {
    formData.append('videoFile', this.videoFile);
  }

  this.postService.addPostWithFiles(formData).subscribe(
    (response) => {
      console.log('Post added successfully!', response);
      this.router.navigate(['/post']);
    },
    (error) => {
      console.error('Error adding post', error);
    }
  );
}


}
