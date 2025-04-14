import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from '../models/post';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private baseUrl = 'http://localhost:8089/pidevback/posts'; // L'URL avec le context-path
  // adapte selon ton port backend

  constructor(private http: HttpClient) {}

 

  getAllPosts(): Observable<Post[]> {
    return this.http.get<any>(`${this.baseUrl}`).pipe(
      map(response => response.content) // Extract the content array
    );
  }

  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.baseUrl}/${id}`);
  }
  addPostWithFiles(userId: number, formData: FormData): Observable<Post> {
    return this.http.post<Post>(`${this.baseUrl}/${userId}/posts`, formData);

  }
  

  addPost(userId: number, post: Post): Observable<Post> {
    return this.http.post<Post>(`${this.baseUrl}/${userId}/posts`, post);
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
    return this.http.get<{ likes: number, dislikes: number }>(`http://localhost:8089/pidevback/likes/count/post/${postId}`);
  }
}
