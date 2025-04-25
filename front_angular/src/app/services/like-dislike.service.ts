import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LikeDislike } from '../models/likedislike';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LikeDislikeService {
  
     private baseUrl = `${environment.apiUrl}/likes`;

  constructor(private http: HttpClient) {}

  likePost(userId: number, postId: number) {
    return this.http.post(`${this.baseUrl}/${userId}/post/${postId}/like`, {});
  }

  dislikePost(userId: number, postId: number) {
    return this.http.post(`${this.baseUrl}/${userId}/post/${postId}/dislike`, {});
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
