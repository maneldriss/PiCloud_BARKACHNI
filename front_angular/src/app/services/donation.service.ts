import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Donation, DonationStatus } from '../models/donation';
import { environment } from '../environments/environment';

@
Injectable({
  providedIn: 'root'
})
export class DonationService {
       private apiUrl = `${environment.apiUrl}/donation`;

  private donationsUpdated = new Subject<void>();
  jwtService: any;

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
          email: d.donor.email,
          donationPoints: d.donor.donationPoints
        } : null
      }))),
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
      itemDressing: d.itemDressing ? {
        itemID: d.itemDressing.itemID,
        itemName: d.itemDressing.itemName,
        imageUrl: d.itemDressing.imageUrl,
        description: d.itemDressing.description,
        condition: d.itemDressing.condition,
        category: d.itemDressing.category,
        size: d.itemDressing.size,
      } : undefined,
      donor: d.donor,
      status: d.status || DonationStatus.PENDING,

    };
  }
  addDonation(donation: Omit<Donation, 'donationId'>, userId: number): Observable<Donation> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.jwtService.getToken()}`,
      'Content-Type': 'application/json', // Utilisez uniquement application/json
      'Accept': 'application/json'
    });
  
    // Préparation du payload
    const payload = {
      ...donation,
      status: DonationStatus.PENDING, // Statut par défaut
      donationDate: new Date().toISOString(), // Ajout de la date si nécessaire
      donor: { id: userId } // Format correct pour le backend
    };
  
    // Envoyer la requête avec l'URL correcte
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