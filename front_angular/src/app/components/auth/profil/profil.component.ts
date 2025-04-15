import { Component, OnInit, ViewChild,ElementRef  } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { User } from 'src/app/models/user';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
[x: string]: any;
 
  user: User = {
    id: 0,
    firstname: '',
    lastname: '',
    bio: null,
    profilePicture: null,
    dateOfBirth: null,
    email: '',
    accountLocked: false,
    enabled: true,
    roles: [],
    currentlyOnline: false,
    lastConnection: ""
  };
  loading = true;
  isLoading = true;
  error: string | null = null;
  profileImageUrl: string | ArrayBuffer | null = null;
  defaultImage: string = 'assets/default-profile.png';
  errorMessage!: string;
  showCameraOptionsModal = false;
  showCameraPreview = false;
  mediaStream: MediaStream | null = null;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
   
   
      this.loadUserProfile();
    
  }
  loadUserProfile(): void {
    this.isLoading = true;
 
    // Vérifier d'abord l'utilisateur courant
    const currentUser = this.authService.getCurrentUser();
    console.log("Cuurent ",currentUser)
    if (currentUser) {
      this.user = currentUser;
      this.isLoading = false;
    }

    // Toujours rafraîchir depuis le serveur
   
  }
  showCameraOptions() {
    this.showCameraOptionsModal = true;
  }

  closeCameraOptions() {
    this.showCameraOptionsModal = false;
  }
  openFileSelector() {
    this.fileInput.nativeElement.click();
    this.closeCameraOptions();
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    
    // Validate file type
    if (!file.type.match(/image\/(jpeg|jpg|png|gif)/)) {
      this.errorMessage = 'Please select a valid image file (JPEG, PNG, GIF)';
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2097152) {
      this.errorMessage = 'Image size must be less than 2MB';
      return;
    }

    // Preview image
    this.previewImage(file);
    
    // Upload image
    this.uploadProfileImage(file);
  }
  async openCamera() {
    this.closeCameraOptions();
    this.showCameraPreview = true;
    
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });
      this.videoElement.nativeElement.srcObject = this.mediaStream;
    } catch (err) {
      console.error("Camera access error:", err);
      this.errorMessage = "Could not access camera";
      this.closeCamera();
    }
  }

  capturePhoto() {
    const video = this.videoElement.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'profile-photo.png', { type: 'image/png' });
          this.onFileSelected({ target: { files: [file] } } as any);
        }
      }, 'image/png');
    }
    
    this.closeCamera();
  }

  closeCamera() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    this.showCameraPreview = false;
  }
  private previewImage(file: File): void {
    const reader = new FileReader();
    
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.profileImageUrl = e.target?.result as string;
    };
    
    reader.onerror = () => {
      console.error('Error reading file');
      this.profileImageUrl = this.defaultImage;
    };
    
    reader.readAsDataURL(file);
  }

  
uploadProfileImage(file: File): void {
  console.log('Attempting to upload file:', file.name, file.size);
  
  this.authService.uploadImage(file).subscribe({
    next: (response) => {
      console.log('Upload successful', response);
      this.updateUserProfile({ profilePicture: response.imageUrl });
      // Handle success
    },
    error: (err) => {
      console.error('Full error details:', err);
      if (err instanceof HttpErrorResponse) {
        console.error('Status:', err.status);
        console.error('Headers:', err.headers);
        console.error('Error message:', err.message);
      }
    }
  });
}
  
updateUserProfile(credentials: { profilePicture: string }): void {
    this.authService.updateUserProfile(credentials).subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to update profile';
        this.loading = false;
        console.error(err);
      }
    });
  }

  submitProfileUpdate(credentials: { profilePicture: string }): void {
    this.authService.updateUserProfile(credentials).subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to update profile';
        this.loading = false;
        console.error(err);
      }
    });
  }

  

  calculateAge(birthDate: string | null | undefined): number {
    if (!birthDate) return 0;
    
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    
    if (isNaN(birthDateObj.getTime())) return 0;
    
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    
    return age;
  }
}