import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, tap } from 'rxjs';
import { Donation } from '../models/donation';

@Injectable({
  providedIn: 'root'
})
export class DonationService {
  private apiUrl = 'http://localhost:8089/BarkachniPI/donation';

  constructor(private http: HttpClient) { }

  getAllDonations(): Observable<Donation[]> {
    return this.http.get<any>(`${this.apiUrl}/retrieve-all-donations`).pipe(
      tap(response => console.log('Réponse API (raw):', response)),
      map(response => {
        // Adaptez selon la structure réelle de votre réponse
        if (Array.isArray(response)) {
          return response.map((item: any) => ({
            donationId: item.donationId || item.donation_id,
            donationType: item.donationType || item.donation_type,
            amount: item.amount,
            donationDate: item.donationDate ? new Date(item.donationDate) : new Date(),
            itemDressing: item.itemDressing || item.item_dressing,
            donor: item.donor || item.user
          }));
        }
        return [];
      }),
      catchError(error => {
        console.error('Erreur API:', error);
        throw 'Échec du chargement des dons';
      })
    );
  }
  
  private mapDonation(apiDonation: any): Donation {
    return {
      donationId: apiDonation.donation_id || apiDonation.donationId,
      donationType: apiDonation.donation_type || apiDonation.donationType,
      amount: apiDonation.amount,
      itemDressing: apiDonation.item_dressing || apiDonation.itemDressing,
      donor: apiDonation.user || apiDonation.donor
    };
  }

 /* addDonation(donation: Donation, userId: number): Observable<Donation> {
    return this.http.post<Donation>(`${this.apiUrl}/add-donation?userId=${userId}`, donation);
  }*/
   /* addDonation(donation: Donation, userId: number): Observable<Donation> {
      console.log("Sending:", JSON.stringify({
        ...donation,
        donor: { idUser: userId }
      }, null, 2));
      
      return this.http.post<Donation>(`${this.apiUrl}/add-donation?userId=${userId}`, donation)
        .pipe(
          tap(response => console.log("Response:", response)),
          catchError(error => {
            console.error("Full error:", error);
            throw error;
          })
        );
    }*/
   // donation.service.ts
   addDonation(donation: Donation, userId: number): Observable<Donation> {
    const payload = {
      ...donation,
      donationDate: new Date().toISOString() // Ajout obligatoire
    };
  
    return this.http.post<Donation>(`${this.apiUrl}/add-donation?userId=${userId}`, payload)
      .pipe(
        catchError(error => {
          console.error('Erreur complète:', error);
          const errorMessage = error.error?.message 
            || error.message 
            || 'Erreur inconnue du serveur';
          throw new Error(errorMessage);
        })
      );
  }

  deleteDonation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove-donation/${id}`);
  }

 
   // Dans le service donation.service.ts
/*updateDonation(donation: Donation): Observable<Donation> {
  console.log('PUT Request Data:', donation); // <-- Vérifiez les données envoyées
  return this.http.put<Donation>
  (`${this.apiUrl}/modify-donation/${donation.donationId}`, donation);
}*/
// donation.service.ts
getDonationById(id: number): Observable<Donation> {
  return this.http.get<Donation>(`${this.apiUrl}/retrieve-donation/${id}`).pipe(
    map(response => ({
      ...response,
      itemDressing: response.itemDressing ? {
        itemID: response.itemDressing.itemID,
        itemName: response.itemDressing.itemName,
        size: response.itemDressing.size
      } : null
    })),
    catchError(error => {
      console.error('Error loading donation:', error);
      throw 'Error loading donation details';
    })
  );
}
updateDonation(donation: Donation): Observable<Donation> {
  if (!donation.donationId) {
    throw new Error('Donation ID is required for update');
  }

  // Formatage complet pour le backend
  const payload = {
    donationId: donation.donationId,
    donationType: donation.donationType,
    amount: donation.amount,
    itemDressing: donation.itemDressing ? { 
      itemID: donation.itemDressing.itemID,
      itemName: donation.itemDressing.itemName // Ajout crucial
    } : null
  };

  return this.http.put<Donation>(
    `${this.apiUrl}/modify-donation/${donation.donationId}`,
    payload
  ).pipe(
    catchError(error => {
      console.error('Update error:', error);
      throw 'Failed to update donation: ' + (error.error?.message || error.message);
    })
  );
}
 /* getDonationById(id: number): Observable<Donation> {
    return this.http.get<Donation>(`${this.apiUrl}/retrieve-donation/${id}`);
  }*/
}