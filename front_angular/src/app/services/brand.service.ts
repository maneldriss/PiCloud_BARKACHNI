import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Brand } from '../models/brand';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private apiUrl = 'http://localhost:8081/pilezelefons/brand';

  constructor(private http: HttpClient) { }

  getAllBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${this.apiUrl}/retrieve-all-brands`);
  }

  getBrandById(id: number): Observable<Brand> {
    return this.http.get<Brand>(`${this.apiUrl}/retrieve-brand/${id}`);
  }

  addBrand(brand: Brand): Observable<Brand> {
    return this.http.post<Brand>(`${this.apiUrl}/add-brand`, brand);
  }

  updateBrand(brand: Brand): Observable<Brand> {
    return this.http.put<Brand>(`${this.apiUrl}/modify`, brand);
  }
  uploadLogo(formData: FormData): Observable<string> {
    return this.http.post(
      `${this.apiUrl}/upload-logo`,
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

  deleteBrand(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove-brand/${id}`);
  }

  findBrandByName(name: string): Observable<Brand> {
    return this.http.get<Brand>(`${this.apiUrl}/find-by-name/${name}`);
  }
}