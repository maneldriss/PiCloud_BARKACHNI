import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Commentaire } from '../models/commentaire';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { JwtService } from './jwt/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class CommentaireService {


   private baseUrl = `${environment.apiUrl}/commentaires`;

  constructor(private http: HttpClient, private jwtservice:JwtService) {}





  addCommentaire(postId: number, comment: any): Observable<Commentaire> {
    // Récupération du token depuis le AuthService
    const token = this.jwtservice.getToken(); // Assurez-vous que cette méthode existe dans votre AuthService
    
    // Création des headers avec le token d'authentification
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json; charset=utf-8')
      .set('Accept', 'application/json; charset=utf-8')
      .set('Authorization', `Bearer ${token}`); // Ajout du header d'authentification

    return this.http.post<Commentaire>(
      `${this.baseUrl}/${postId}/commentaires`, 
      JSON.stringify(comment),
      { headers }
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
    const headers = new HttpHeaders()
        .set('Content-Type', 'application/json; charset=utf-8')
        .set('Accept', 'application/json; charset=utf-8');

    const updateData = {
        content: commentaire.content
    };
    
    return this.http.put<Commentaire>(
        `${this.baseUrl}/${commentaire.idCommentaire}`,
        JSON.stringify(updateData),
        { headers }
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
