// item-dressing.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ItemDressing } from '../models/item-dressing';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ItemDressingService {
 
   private apiUrl = "http://localhost:8088/barkachni/item";

  constructor(private http: HttpClient) { }

  getAvailableItems(): Observable<ItemDressing[]> {
    return this.http.get<ItemDressing[]>(`${this.apiUrl}/retrieve-all-items`);
  }
  
  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('image', file);
  
    return this.http.post<string>(`${this.apiUrl}/upload`, formData).pipe(
      catchError(err => {
        console.error('Upload error:', err);
        return throwError(err);
      })
    );
}}