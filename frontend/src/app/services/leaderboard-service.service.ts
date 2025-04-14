import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardServiceService {
  private apiUrl = 'http://localhost:8089/BarkachniPI/api/donors';

  constructor(private http: HttpClient) {}

  getTopDonors(page: number, size: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/leaderboard?page=${page}&size=${size}`).pipe(
      map(response => ({
        content: response.content.map((donor: any) => ({
          email: donor.email,
          points: donor.donationPoints || donor.points || 0, // Plusieurs noms possibles
          totalDonated: donor.totalDonated || 0
        })),
        totalElements: response.totalElements
      }))
    );
  }

  private calculateUserPoints(donor: any): number {
    let totalPoints = 0;
    
    // Calcul pour les dons d'argent (1 point = 1 dinar)
    if (donor.moneyDonations) {
      totalPoints += donor.moneyDonations.reduce((sum: number, donation: any) => sum + (donation.amount || 0), 0);
    }
    
    // Calcul pour les dons matériels (50 points par article)
    if (donor.clothingDonations) {
      totalPoints += donor.clothingDonations.length * 50;
    }
    
    return totalPoints;
  }
}
