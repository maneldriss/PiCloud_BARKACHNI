import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Ad } from '../models/ad';

@Injectable({
  providedIn: 'root'
})
export class AdService {
  private apiUrl = 'http://localhost:8081/pilezelefons/ad';

  constructor(private http: HttpClient) { }

  getAllAds(): Observable<Ad[]> {
    return this.http.get<Ad[]>(`${this.apiUrl}/retrieve-all-ads`);
  }

  getAdById(id: number): Observable<Ad> {
    return this.http.get<Ad>(`${this.apiUrl}/retrieve-ad/${id}`);
  }

  addAd(ad: Ad): Observable<Ad> {
    // Ensure proper date format
    const formattedAd = {
      ...ad,
      expDate: new Date(ad.expDate).toISOString()
    };
    return this.http.post<Ad>(`${this.apiUrl}/add-ad`, formattedAd);
  }

  updateAd(ad: Ad): Observable<Ad> {
    // Ensure proper date format
    const formattedAd = {
      ...ad,
      expDate: new Date(ad.expDate).toISOString()
    };
    return this.http.put<Ad>(`${this.apiUrl}/modify`, formattedAd);
  }

  deleteAd(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove-ad/${id}`);
  }

  findAdsByTitle(title: string): Observable<Ad[]> {
    return this.http.get<Ad[]>(`${this.apiUrl}/find-by-title/${title}`);
  }

  findAdsByBrandId(brandId: number): Observable<Ad[]> {
    return this.http.get<Ad[]>(`${this.apiUrl}/find-by-brand/${brandId}`);
  }

  incrementAdClicks(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/increment-clicks/${id}`, {});
  }
  uploadAdImage(formData: FormData): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}/upload-image`,
      formData,
      {
        responseType: 'text' as 'json'  // Important for string response
      }
    );
  }
  getPendingAds(): Observable<Ad[]> {
    return this.http.get<Ad[]>(`${this.apiUrl}/pending`);
  }

  approveAd(adId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${adId}/approve`, {});
  }

  rejectAd(adId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove-ad/${adId}`);
}
  // In your ad.service.ts
findApprovedAdsByBrandId(brandId: number): Observable<Ad[]> {
  console.log('Fetching approved ads for brand:', brandId);
  return this.http.get<Ad[]>(`${this.apiUrl}/brand/${brandId}?status=APPROVED`).pipe(
    tap(ads => console.log('Received ads:', ads)),
    catchError(err => {
      console.error('Error fetching ads:', err);
      return throwError(err);
    })
  );
}
}