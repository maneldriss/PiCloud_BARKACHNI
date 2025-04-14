import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LikeDislike } from '../models/likedislike';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LikeDislikeService {
  private baseUrl = 'http://localhost:8089/pidevback/likes';

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
  

}
