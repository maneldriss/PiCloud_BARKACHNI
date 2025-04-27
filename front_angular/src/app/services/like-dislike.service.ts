import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LikeDislike } from '../models/likedislike';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { JwtService } from './jwt/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class LikeDislikeService {
  
     private baseUrl = `${environment.apiUrl}/likes`;

  constructor(private http: HttpClient ,  private jwtservice:JwtService) {}

  likePost(userId: number, postId: number) {
     const headers = new HttpHeaders({
          'Authorization': `Bearer ${this.jwtservice.getToken()}`
        });
    return this.http.post(`${this.baseUrl}/post/${postId}/like`, {}, { headers });
  }

  dislikePost(userId: number, postId: number) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.jwtservice.getToken()}`
    });
    return this.http.post(`${this.baseUrl}/post/${postId}/dislike`, {}, { headers });
  }
  

  getCounts(postId: number): Observable<{ likes: number, dislikes: number }> {
    return this.http.get<{ likes: number, dislikes: number }>(`${this.baseUrl}/count/post/${postId}`);
  }
  
 
  getUsersWhoLiked(postId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/users/${postId}`);
  }

  getUsersWhoDisliked(postId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/dislikes/users/${postId}`);
  }
  react(userId: number, postId: number, reaction: string) {
    return this.http.post(`/likes/${userId}/post/${postId}/react`, { reactionType: reaction });
  }
  

}
