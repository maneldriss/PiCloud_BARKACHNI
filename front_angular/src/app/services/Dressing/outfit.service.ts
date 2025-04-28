import { Injectable } from '@angular/core';
import {catchError, of, switchMap, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Outfit} from "../../models/Dressing/outfit.model";
import {JwtService} from "../jwt/jwt.service";
import {AuthService} from "../auth/auth.service";

// Create a simple interface that matches what the backend expects for an item reference
interface ItemReference {
  itemID: number;
}

@Injectable({
  providedIn: 'root'
})
export class OutfitService {
  private apiUrl = 'http://localhost:8088/barkachni/outfit';

  constructor(private http: HttpClient,
              private jwtService: JwtService,
              private authService: AuthService) {
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
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser || !currentUser.dressing) {
      return throwError(() => new Error('User or dressing information is missing.'));
    }
    
    // Create a clean outfit object with only necessary properties
    // Make sure to use the correct field name "dressingID" to match backend expectation
    const cleanOutfit = {
      outfitName: outfit.outfitName,
      description: outfit.description || '',
      season: outfit.season || '',
      occasion: outfit.occasion || '',
      isAiGenerated: outfit.isAiGenerated || false,
      imageUrl: outfit.imageUrl || '',
      // Convert items to simple objects with just itemID property to prevent deserialization errors
      items: outfit.items ? outfit.items.map(item => ({ itemID: item.itemID } as ItemReference)) : [],
      dressing: {
        id: currentUser.dressing.id // Use id to match the Dressing entity field in backend
      }
    };
    
    console.log('Sending outfit data:', JSON.stringify(cleanOutfit));
    return this.http.post<Outfit>(`${this.apiUrl}/add-outfit`, cleanOutfit, { headers })
      .pipe(catchError(this.handleError));
  }

  updateOutfit(outfit: Outfit) {
    const headers = this.getAuthHeaders();
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser || !currentUser.dressing) {
      return throwError(() => new Error('User or dressing information is missing.'));
    }

    // Create a clean outfit object with only necessary properties
    const updatedOutfit = {
      outfitID: outfit.outfitID,
      outfitName: outfit.outfitName,
      description: outfit.description || '',
      season: outfit.season || '',
      occasion: outfit.occasion || '',
      isAiGenerated: outfit.isAiGenerated || false,
      imageUrl: outfit.imageUrl || '',
      // Convert items to simple objects with just itemID property to prevent deserialization errors
      items: outfit.items ? outfit.items.map(item => ({ itemID: item.itemID } as ItemReference)) : [],
      dressing: {
        id: currentUser.dressing.id // Use id to match the Dressing entity field in backend
      }
    };

    console.log('Updating outfit with data:', JSON.stringify(updatedOutfit));
    return this.http.put<Outfit>(`${this.apiUrl}/update-outfit`, updatedOutfit, { headers })
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

