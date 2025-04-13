import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Donation, DonationStatus } from '../models/donation';

@
Injectable({
  providedIn: 'root'
})
export class DonationService {
  private apiUrl = 'http://localhost:8089/BarkachniPI/donation';
  private donationsUpdated = new Subject<void>();

  constructor(private http: HttpClient) { }
  donationsUpdated$ = this.donationsUpdated.asObservable();

  getAllDonations(): Observable<Donation[]> {
    return this.http.get<Donation[]>(`${this.apiUrl}/retrieve-all-donations`).pipe(
      map((donations: any[]) => donations.map(d => ({
        ...d,
        // Assurez-vous que les noms de champs correspondent à votre interface
        donationId: d.donation_id || d.donationId,
        donationType: d.donation_type || d.donationType,
        itemDressing: d.itemDressing ? {
          itemID: d.itemDressing.itemid || d.itemDressing.itemID,
          itemName: d.itemDressing.item_name || d.itemDressing.itemName,
          imageUrl: d.itemDressing.image_url || d.itemDressing.imageUrl
        } : null,
        donor: d.donor ? {
          name: d.donor.name,
          email: d.donor.email
        } : null
      }))),
      tap(d => console.log('Donations after mapping:', d)) // Debug
    );
  }
  getDonationById(id: number): Observable<Donation> {
    return this.http.get<Donation>(`${this.apiUrl}/retrieve-donation/${id}`).pipe(
      map(this.parseDonation))
  }



  updateDonation(donation: Donation): Observable<Donation> {
    return this.http.put<Donation>(
      `${this.apiUrl}/modify-donation/${donation.donationId}`,
      donation
    );
  }

  private parseDonation(d: any): Donation {
    return {
      donationId: d.donationId,
      donationType: d.donationType,
      amount: d.amount,
      itemDressing: d.itemDressing ? {
        itemID: d.itemDressing.itemID,
        itemName: d.itemDressing.itemName,
        imageUrl: d.itemDressing.imageUrl
      } : undefined,
      donor: d.donor,
      status: d.status || DonationStatus.PENDING,

    };
  }
  addDonation(donation: Omit<Donation, 'donationId'>, userId: number): Observable<Donation> {
    const payload = {
      ...donation,
      status: DonationStatus.PENDING, // Force le statut PENDING
      donationDate: new Date().toISOString()
    };
    return this.http.post<Donation>(`${this.apiUrl}/add-donation?userId=${userId}`, payload);
  }
  
  // donation.service.ts
deleteDonation(id: number): Observable<void> {
  if (!id) {
    return throwError(() => new Error('Invalid donation ID'));
  }
  return this.http.delete<void>(`${this.apiUrl}/remove-donation/${id}`);
}
approveDonation(id: number): Observable<Donation> {
  if (!id) {
    return throwError(() => new Error("Invalid ID"));
  }
  return this.http.patch<Donation>(`${this.apiUrl}/approve/${id}`, {}).pipe(
    tap(() => this.notifyUpdates())
  );
}

rejectDonation(id: number): Observable<Donation> {
  if (!id) {
    return throwError(() => new Error("Invalid ID"));
  }
  return this.http.patch<Donation>(`${this.apiUrl}/reject/${id}`, {}).pipe(
    tap(() => this.notifyUpdates())
  );
}

notifyUpdates() {
  this.donationsUpdated.next();
}
}