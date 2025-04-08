import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

}