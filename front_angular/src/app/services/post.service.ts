import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Post } from '../models/post';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { JwtService } from './jwt/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {


  // adapte selon ton port backend
   private baseUrl = `${environment.apiUrl}/posts`; 

  constructor(private http: HttpClient, private jwtservice:JwtService) {}

 

  getAllPosts(): Observable<Post[]> {
    return this.http.get<any>(`${this.baseUrl}/getposts`).pipe(
      map(response => response.content),
      catchError(error => {
        console.error('Erreur lors de la récupération des posts :', error);
        return throwError(() => error);
      })
    );
  }
  

  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.baseUrl}/${id}`);
  }
  addPostWithFiles(formData: FormData): Observable<Post> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.jwtservice.getToken()}`
    });
  
    return this.http.post<Post>(`${this.baseUrl}/add-post`, formData, { headers });
  }
  
  

  addPost(post: Post): Observable<Post> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.jwtservice.getToken()}`
    });
  
    return this.http.post<Post>(`${this.baseUrl}/add-post`, post, { headers });
  }
  
  
  updatePost(userId: number, post: Post): Observable<Post> {
    return this.http.put<Post>(`${this.baseUrl}/${userId}/posts`, post);
  }


  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  
  likePost(postId: number) {
    const userId = 1; // à adapter avec l'utilisateur connecté
    return this.http.post(`/likes/${userId}/post/${postId}/like`, {});
  }
  
  dislikePost(postId: number) {
    const userId = 1; // à adapter aussi
    return this.http.post(`/likes/${userId}/post/${postId}/dislike`, {});
  }
  getPostCounts(postId: number): Observable<{ likes: number, dislikes: number }> {
    return this.http.get<{ likes: number, dislikes: number }>(`${environment.apiUrl}/likes/count/post/${postId}`);
  }

  generateAIDescription(imageFile: File): Observable<string> {
    const formData = new FormData();
    formData.append('imageFile', imageFile);
    
    return this.http.post(
      `${this.baseUrl}/generate-description`,
      formData,
      { responseType: 'text' } // Forcer le type de réponse en texte
    ).pipe(
      catchError(error => {
        console.error('Erreur API:', error);
        return throwError(() => new Error('Échec de la génération. Veuillez réessayer.'));
      })
    );
  }
}
