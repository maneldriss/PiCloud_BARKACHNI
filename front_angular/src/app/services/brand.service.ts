import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, catchError } from 'rxjs';
import { Brand } from '../models/brand';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  getAllBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${this.apiUrl}/brand/retrieve-all-brands`);
  }

  getBrandById(id: number): Observable<Brand> {
    return this.http.get<Brand>(`${this.apiUrl}/brand/retrieve-brand/${id}`);
  }

  addBrand(brand: Brand): Observable<Brand> {
    return this.http.post<Brand>(`${this.apiUrl}/brand/add-brand`, brand);
  }

  updateBrand(brand: Brand): Observable<Brand> {
    return this.http.put<Brand>(`${this.apiUrl}/brand/modify`, brand);
  }
  uploadLogo(formData: FormData): Observable<string> {
    return this.http.post(
      `${this.apiUrl}/brand/upload-logo`,
      formData,
      { responseType: 'text' }  // Tell Angular to expect text response
    ).pipe(
      map((relativePath: string) => {
        // Convert to full URL if needed
        return relativePath.startsWith('http') ? relativePath : 
               `${this.apiUrl}${relativePath}`;
      })
    );
  }

  deleteBrand(brandId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/brand/remove-brand/${brandId}`).pipe(
      catchError(err => {
        // Handle specific error cases
        if (err.status === 400 && err.error?.message) {
          throw new Error(err.error.message);
        }
        throw new Error('Failed to delete brand. Please try again.');
      })
    );
  }

  findBrandByName(name: string): Observable<Brand> {
    return this.http.get<Brand>(`${this.apiUrl}/brand/find-by-name/${name}`);
  }
}