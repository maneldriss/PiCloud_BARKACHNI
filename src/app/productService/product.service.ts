import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8089/BarkachniPI/marketplace';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {  
    return this.http.get<Product[]>(`${this.apiUrl}/retrieve-all-products`);

  }
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/retrieve-product/${id}`);
  }

  addProduct(Product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/add-product`, Product);
  }


   updateProduct(product: Product, productId: number): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/modify-product/${productId}`, product);
  }
  
  
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove-product/${id}`);
  }

  findProductByName(name: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/find-by-name/${name}`);
  }
//reservation purposes
  reserveProduct(productId: number): Observable<any> {
    const staticUserId = 1; // replace with your test user ID
    return this.http.post(`${this.apiUrl}/products/${productId}/reserve`, null, {
      params: { userId: staticUserId.toString() }
    });
    
  }
  
  getReservedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/reserved-products`);
  }

  unreserveProduct(productId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/unreserve-product/${productId}`);
  }
//recommendation purposes
recommendProducts(gender: string, category: string, productId: number): Observable<Product[]> {
  return this.http.get<Product[]>(`${this.apiUrl}/recommend`, {
    params: {
      genderProduct: gender,
      categoryProduct: category,
      productId: productId.toString()
    }
  });
}

//fazet category
uploadWithAutoTag(formData: FormData): Observable<Product> {
  return this.http.post<Product>(
    `${this.apiUrl}/upload-with-autotag`,
    formData
  ).pipe(
    catchError(error => {
      if (error.status === 502) {
        throw new Error('AI service is currently unavailable. Please try again later.');
      }
      throw error;
    })
  );
}

}