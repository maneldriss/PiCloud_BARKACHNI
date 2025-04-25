import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {

     private apiUrl = `${environment.apiUrl}/api/payment`;

  constructor(private http: HttpClient) {}

  createPaymentIntent(amount: number, currency: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-payment-intent`, {
      amount: amount,
      currency: currency.toLowerCase() // Ensure lowercase currency
    });
  }
}