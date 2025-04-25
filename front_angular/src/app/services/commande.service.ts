import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Commande } from '../models/commande'; // Assuming you have a model for 'commande'
import { PlaceOrderRequest } from '../models/place-order-request';
import { environment } from '../environments/environment';
 // Import DTO

@Injectable({
  providedIn: 'root',
})
export class CommandeService {
 // Set base API URL from environment
  private baseUrl = `${environment.apiUrl}/commande`;
  constructor(private http: HttpClient) {}

  // Get all commandes
  getAllCommandes(): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${this.baseUrl}/retrieve-all-commandes`);
  }

  // Get specific commande by ID
  getCommandeById(commandeId: number): Observable<Commande> {
    return this.http.get<Commande>(`${this.baseUrl}/retrieve-commande/${commandeId}`);
  }

  // Add a new commande using the DTO
  placeOrder(request: PlaceOrderRequest, cartId: number, userId: number): Observable<Commande> {
    return this.http.post<Commande>(`${this.baseUrl}/place-order/${cartId}/${userId}`, request);
}

  // Remove a commande by ID
  removeCommande(commandeId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/remove-commande/${commandeId}`);
  }

  // Modify an existing commande
  modifyCommande(commande: Commande): Observable<Commande> {
    return this.http.put<Commande>(`${this.baseUrl}/modify-commande`, commande);
  }

  // Get the total price of a specific commande by ID
  getCommandeTotal(commandeId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/retrieve-commande-total/${commandeId}`);
  }

  // Assign a cart to a commande
  assignCartToCommande(commandeId: number, cartId: number): Observable<Commande> {
    return this.http.put<Commande>(`${this.baseUrl}/assign-cart-to-commande/${commandeId}/${cartId}`, {});
  }
  updatePaymentStatus(commandeId: number, status: string): Observable<void> {
    const url = `${this.baseUrl}/${commandeId}/payment-status/${status}`;
    return this.http.put<void>(url, {});
  }
}
