import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Commentaire } from '../models/commentaire';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentaireService {

  private baseUrl = 'http://localhost:8089/pidevback/commentaires';

  constructor(private http: HttpClient) {}



  addCommentaire(postId: number, commentaire: { content: string }): Observable<Commentaire> {
    return this.http.post<Commentaire>(
      `${this.baseUrl}/${postId}/commentaires`, 
      { content: commentaire.content } // Envoyez seulement le contenu
    );
  }
  // Récupérer tous les commentaires
  getAllCommentaires(): Observable<Commentaire[]> {
    return this.http.get<Commentaire[]>(`${this.baseUrl}`);
  }

  // Récupérer un commentaire par son ID
  getCommentaireById(id: number): Observable<Commentaire> {
    return this.http.get<Commentaire>(`${this.baseUrl}/${id}`);
  }

  // Mettre à jour un commentaire
 

  updateCommentaire(commentaire: Commentaire): Observable<Commentaire> {
    // Envoyez seulement l'ID et le contenu
    const updateData = {
      idCommentaire: commentaire.idCommentaire,
      content: commentaire.content
    };
    
    return this.http.put<Commentaire>(
      `${this.baseUrl}/${commentaire.idCommentaire}`,
      updateData
    );
  }

  // Supprimer un commentaire
  deleteCommentaire(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

    // Récupérer les commentaires d'un post
    getCommentairesByPost(postId: number): Observable<Commentaire[]> {
      return this.http.get<Commentaire[]>(`${this.baseUrl}/post/${postId}`);
    }

}
