import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

interface RemoveBackgroundResponse {
  imageUrl: string;
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ImageProcessingService {

  private apiUrl = 'http://localhost:8088/barkachni/images';

  constructor(private http: HttpClient) {}

  removeBackground(file: File): Observable<RemoveBackgroundResponse> {
    const formData = new FormData();
    formData.append('image', file);

    return this.http.post<RemoveBackgroundResponse>(`${this.apiUrl}/remove-background`, formData);
  }
}
