import { Injectable } from '@angular/core';
import {catchError, of, switchMap, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Outfit} from "../../models/Dressing/outfit.model";
import {JwtService} from "../jwt/jwt.service";
import {UserService} from "../user/user.service";

@Injectable({
  providedIn: 'root'
})
export class OutfitService {
  private apiUrl = 'http://localhost:8088/barkachni/outfit';

  constructor(private http: HttpClient,
              private jwtService: JwtService,
              private userService: UserService) {
  }

  private getAuthHeaders() {
    const token = this.jwtService.getToken();
    if (!token) {
      return new HttpHeaders();
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
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
    const headers = this.getAuthHeaders();

    return this.userService.getCurrentUser().pipe(
      switchMap(user => {
        if (!user || !user.dressing) {
          return throwError(() => new Error('User or dressing information is missing.'));
        }
        outfit.dressing = user.dressing;
        return this.http.post<Outfit>(`${this.apiUrl}/add-outfit`, outfit, { headers });
      }),
      catchError(this.handleError)
    );
  }


  updateOutfit(outfit: Outfit) {
    console.log('Sending update request to:', `${this.apiUrl}/update-outfit`);
    console.log('With data:', JSON.stringify(outfit));

    return this.http.put<Outfit>(`${this.apiUrl}/update-outfit`, outfit)
      .pipe(catchError(this.handleError));
  }

  getOutfitsByUser(userId: number) {
    return this.http.get<Outfit[]>(`${this.apiUrl}/retrieve-outfits-by-user/${userId}`)
      .pipe(catchError(this.handleError));
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

