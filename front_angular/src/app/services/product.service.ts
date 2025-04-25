import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { Product } from '../models/product';
import { environment } from '../environments/environment';
import { JwtService } from './jwt/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
 
  private apiUrl = `${environment.apiUrl}`;
  constructor(private http: HttpClient,private jwtService: JwtService) {}

  getProducts(): Observable<Product[]> {  
    return this.http.get<Product[]>(`${this.apiUrl}/marketplace/retrieve-all-products`);

  }
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/marketplace/retrieve-product/${id}`);
  }

  addProduct(Product: Product): Observable<Product> {
   // return this.http.post<Product>(`${this.apiUrl}/marketplace/add-product`, Product);
   const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.jwtService.getToken()}`
  });

  return this.http.post<Product>(`${environment.apiUrl}/marketplace/add-product`, Product, { headers });
  }


   updateProduct(product: Product, productId: number): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/marketplace/modify-product/${productId}`, product);
  }
  
  
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/marketplace/remove-product/${id}`);
  }

  findProductByName(name: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/marketplace/find-by-name/${name}`);
  }

  reserveProduct(productId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.jwtService.getToken()}`
    });
  
    return this.http.post(
      `${this.apiUrl}/marketplace/products/${productId}/reserve`,
      null,
      { headers }
    );
  }
  
  getReservedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/marketplace/reserved-products`);
  }

  unreserveProduct(productId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/marketplace/unreserve-product/${productId}`);
  }

  //recommendation purposes
recommendProducts(gender: string, category: string, productId: number): Observable<Product[]> {
  return this.http.get<Product[]>(`${this.apiUrl}/marketplace/recommend`, {
    params: {
      genderProduct: gender,
      categoryProduct: category,
      productId: productId.toString()
    }
  });
}

//fazet category
uploadWithAutoTag(formData: FormData): Observable<Product> {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.jwtService.getToken()}`
  });

  return this.http.post<Product>(
    `${this.apiUrl}/marketplace/upload-with-autotag`,
    formData,
    { headers }
  );
}

updateProductWithImage(productId: number, formData: FormData): Observable<Product> {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.jwtService.getToken()}`
  });

  return this.http.post<Product>(
    `${this.apiUrl}/marketplace/update-with-autotag/${productId}`,
    formData,
    { headers }
  );
}

retrieveCurrentUserProducts(): Observable<Product[]> {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.jwtService.getToken()}`
  });

  return this.http.get<Product[]>(
    `${this.apiUrl}/marketplace/retrieve-my-products`,
    { headers }
  
  );
}


}