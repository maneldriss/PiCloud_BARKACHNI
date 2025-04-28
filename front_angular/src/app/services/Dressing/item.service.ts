import { Injectable } from '@angular/core';
import {catchError, Observable, switchMap, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Item} from "../../models/Dressing/item.model";
import {UserService} from "../user/user.service";
import {JwtService} from "../jwt/jwt.service";

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private apiUrl = 'http://localhost:8088/barkachni/item';

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  private getAuthHeaders() {
    const token = this.jwtService.getToken();
    if (!token) {
      return new HttpHeaders();
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.apiUrl}/retrieve-all-items`)
      .pipe(catchError(this.handleError));
  }

  getItemById(id: number): Observable<Item> {
    return this.http.get<Item>(`${this.apiUrl}/retrieve-item/${id}`)
      .pipe(catchError(this.handleError));
  }

  addItem(item: Item): Observable<Item> {
    const headers = this.getAuthHeaders();
    return this.http.post<Item>(`${this.apiUrl}/add-item`, item, { headers })
      .pipe(catchError(this.handleError));
  }

  updateItem(item: Item): Observable<Item> {
    const headers = this.getAuthHeaders();
    console.log('Sending update request to:', `${this.apiUrl}/update-item`);
    console.log('With data:', JSON.stringify(item));

    return this.http.put<Item>(`${this.apiUrl}/update-item`, item, { headers })
      .pipe(catchError(this.handleError));
  }

  deleteItem(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/remove-item/${id}`, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 409) {
            return throwError(() => new Error(error.error));
          }
          if (error.status === 404) {
            // Item was already deleted or doesn't exist
            return new Observable(subscriber => {
              subscriber.next({});
              subscriber.complete();
            });
          }
          return throwError(() => new Error('Something went wrong. Please try again later.'));
        })
      );
  }

  getItemsByUser(userId?: number): Observable<Item[]> {
    const headers = this.getAuthHeaders();

    if (userId !== undefined) {
      return this.http.get<Item[]>(`${this.apiUrl}/retrieve-items-by-user/${userId}`, { headers })
        .pipe(catchError(this.handleError));
    } else {
      return this.userService.getCurrentUser().pipe(
        catchError(this.handleError),
        switchMap(user => {
          const currentUserId = user.id;
          return this.http.get<Item[]>(`${this.apiUrl}/retrieve-items-by-user/${currentUserId}`, { headers });
        })
      );
    }
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

  toggleFavorite(itemId: number, isFavorite: boolean): Observable<Item> {
    const headers = this.getAuthHeaders();
    return this.http.put<Item>(`${this.apiUrl}/toggle-favorite/${itemId}?favorite=${isFavorite}`, {}, { headers })
      .pipe(catchError(this.handleError));
  }
}
