import { Injectable } from '@angular/core';
import {Item} from "../models/item.model";
import {catchError, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private apiUrl = 'http://localhost:8080/barkachni/item';

  constructor(private http: HttpClient) {
  }

  getItems() {
    return this.http.get<Item[]>(`${this.apiUrl}/retrieve-all-items`)
      .pipe(catchError(this.handleError));
  }

  getItemById(id: number) {
    return this.http.get<Item>(`${this.apiUrl}/retrieve-item/${id}`)
      .pipe(catchError(this.handleError));
  }

  addItem(item: Item) {
    return this.http.post<Item>(`${this.apiUrl}/add-item`, item)
      .pipe(catchError(this.handleError));
  }

  updateItem(item: Item) {
    console.log('Sending update request to:', `${this.apiUrl}/update-item`);
    console.log('With data:', JSON.stringify(item));

    return this.http.put<Item>(`${this.apiUrl}/update-item`, item)
      .pipe(catchError(this.handleError));
  }

  deleteItem(id: number) {
    return this.http.delete(`${this.apiUrl}/remove-item/${id}`)
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
