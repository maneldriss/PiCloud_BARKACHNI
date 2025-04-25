import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cart } from '../models/cart';
import { CartItem } from '../models/cartitem';
import { Product } from '../models/product';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
   private apiUrl = `${environment.apiUrl}/cart`;

  constructor(private http: HttpClient) {}

  // Get all carts
  getCarts(): Observable<Cart[]> {
    return this.http.get<Cart[]>(`${this.apiUrl}/retrieve-all-carts`);
  }

  // Get cart by ID
  getCartById(cartId: number): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}/retrieve-cart/${cartId}`);
  }

  // Create new cart
  addCart(cart: Cart): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/add-cart`, cart);
  }

  // Delete cart by ID
  deleteCart(cartId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove-cart/${cartId}`);
  }

  // Add existing item by itemId (optional)
  addItemToCart(cartId: number, itemId: number): Observable<Cart> {
    return this.http.put<Cart>(`${this.apiUrl}/add-item-to-cart/${cartId}/${itemId}`, {});
  }

  // Add a product directly to the cart with a quantity
  addProductToCart(cartId: number, productId: number, quantity: number): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/add-product-to-cart/${cartId}/${productId}/${quantity}`, {});
  }

  // Update quantity of a specific item in the cart
  updateItemQuantity(cartId: number, itemId: number, quantity: number): Observable<Cart> {
    return this.http.put<Cart>(`${this.apiUrl}/update-item-quantity/${cartId}/${itemId}/${quantity}`, {});
  }

  // Remove an item from cart
  removeItemFromCart(cartId: number, itemId: number): Observable<Cart> {
    return this.http.delete<Cart>(`${this.apiUrl}/remove-item-from-cart/${cartId}/${itemId}`);
  }

  // Get total price of the cart
  getCartTotal(cartId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/total/${cartId}`);
  }

  // Optional: Get all items (not tied to a cart)
  getAllItems(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.apiUrl}/retrieve-all-items`);
  }
  getCartByUserId(userId: number): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}/user/${userId}`);
}

}
