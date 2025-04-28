import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Donation, DonationStatus, DonationType } from '../models/donation';
import { environment } from '../environments/environment';
import {JwtService} from "./jwt/jwt.service";

@Injectable({
  providedIn: 'root'
})
export class DonationService {
       private apiUrl = `${environment.apiUrl}/donation`;

  private donationsUpdated = new Subject<void>();

  constructor(private http: HttpClient, private jwtService: JwtService) { }

  donationsUpdated$ = this.donationsUpdated.asObservable();

  getAllDonations(): Observable<Donation[]> {
    return this.http.get<Donation[]>(`${this.apiUrl}/retrieve-all-donations`).pipe(
      map((donations: any[]) => donations.map(d => {
        console.log('Raw donation data:', d); // Debug to see the actual structure
        return {
          ...d,
          // Standardize field names
          donationId: d.donationId,
          donationType: d.donationType,
          // Properly map the item - check both 'item' and 'itemDressing' fields
          itemDressing: d.itemDressing ? {
            itemID: d.itemDressing.itemID,
            itemName: d.itemDressing.itemName,
            imageUrl: d.itemDressing.imageUrl,
            description: d.itemDressing.description,
            condition: d.itemDressing.condition,
            category: d.itemDressing.category,
            size: d.itemDressing.size
          } : null,
          donor: d.donor ? {
            name: d.donor.name,
            email: d.donor.email,
            donationPoints: d.donor.donationPoints
          } : null
        };
      })),
      tap(d => console.log('Donations after mapping:', d)) // Debug
    );
  }
  getDonationById(id: string | number): Observable<Donation> {
    // Convertir en number si nécessaire
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;

    if (isNaN(numericId)) {
      return throwError(() => new Error('Invalid donation ID'));
    }

    return this.http.get<Donation>(`${this.apiUrl}/retrieve-donation/${numericId}`).pipe(
      map(this.parseDonation),
      catchError(error => {
        console.error('Error fetching donation:', error);
        return throwError(() => new Error('Failed to load donation details'));
      })
    );
  }



  updateDonation(donation: Donation): Observable<Donation> {
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json; charset=utf-8')
    .set('Accept', 'application/json; charset=utf-8');
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
      itemDressing: d.item ? {
        itemID: d.item.itemID,
        itemName: d.item.itemName,
        imageUrl: d.item.imageUrl,
        description: d.item.description,
        condition: d.item.condition,
        category: d.item.category,
        size: d.item.size,
      } : undefined,
      donor: d.donor,
      status: d.status || DonationStatus.PENDING,

    };
  }
  addDonation(donation: Omit<Donation, 'donationId'>, userId: number): Observable<Donation> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.jwtService.getToken()}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    // Préparation du payload
    const payload: any = {
      ...donation,
      status: DonationStatus.PENDING,
      donationDate: new Date().toISOString(),
      donor: { id: userId }
    };

    // Ensure itemDressing is properly formatted for the backend
    if (donation.donationType === DonationType.CLOTHING && donation.itemDressing) {
      // Override with just the itemID which is what the backend needs
      payload.itemDressing = {
        itemID: donation.itemDressing.itemID
      };
    }

    return this.http.post<Donation>(`${this.apiUrl}/add-donation`, payload, { headers });
  }


  // donation.service.ts
  deleteDonation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove-donation/${id}`).pipe(
      catchError(error => {
        console.error('Delete error:', error);
        let errorMsg = 'Failed to delete donation';
        if (error.error?.message) {
          errorMsg = error.error.message;
        }
        throw new Error(errorMsg);
      })
    );
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
