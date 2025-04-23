import { Injectable } from '@angular/core';
import {Outfit} from "../models/outfit.model";
import {catchError, of, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class OutfitService {
  private apiUrl = 'http://localhost:8080/barkachni/outfit';

  constructor(private http: HttpClient) {
  }

  getOutfits() {
    return this.http.get<Outfit[]>(`${this.apiUrl}/retrieve-all-outfits`)
      .pipe(catchError(this.handleError));
  }

  getOutfitById(id: number) {
    return this.http.get<Outfit>(`${this.apiUrl}/retrieve-outfit/${id}`)
      .pipe(catchError(this.handleError));
  }

  addOutfit(outfit: Outfit) {
    return this.http.post<Outfit>(`${this.apiUrl}/add-outfit`, outfit)
      .pipe(catchError(this.handleError));
  }

  updateOutfit(outfit: Outfit) {
    console.log('Sending update request to:', `${this.apiUrl}/update-outfit`);
    console.log('With data:', JSON.stringify(outfit));

    return this.http.put<Outfit>(`${this.apiUrl}/update-outfit`, outfit)
      .pipe(catchError(this.handleError));
  }

  getOutfitsByUser(userId: number) {
    return this.http.get<Outfit[]>(`${this.apiUrl}/retrieve-outfits-by-user/${userId}`);
  }

  deleteOutfit(id: number) {
    return this.http.delete(`${this.apiUrl}/remove-outfit/${id}`)
      .pipe(catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);

    if (error.error instanceof ErrorEvent) {
      console.error('Client-side error:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`
      );
    }

    return throwError(() => new Error('Something went wrong. Please try again later.'));
  }
}

