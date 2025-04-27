import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, Subject, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardServiceService {

     private apiUrl = `${environment.apiUrl}/api/donors`;

  constructor(private http: HttpClient) {}

  getTopDonors(page: number, size: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/leaderboard?page=${page}&size=${size}`).pipe(
        map(response => ({
            content: response.content?.map((item: any) => ({
                email: item.email,
                points: item.points || 0,
                totalDonated: item.totalDonated || 0
            })) || [],
            totalElements: response.totalElements || 0
        })),
        catchError(error => {
            console.error('Error fetching top donors:', error);
            return of({ content: [], totalElements: 0 });
        })
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
