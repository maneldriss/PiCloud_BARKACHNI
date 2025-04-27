import { Component, OnInit, OnDestroy } from '@angular/core';
import { LeaderboardServiceService } from 'src/app/services/leaderboard-service.service';
import { DonationService } from 'src/app/services/donation.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css'],
})
export class LeaderboardComponent implements OnInit, OnDestroy {
  topDonors: any[] = [];
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private leaderboardService: LeaderboardServiceService,
    private donationService: DonationService
  ) {}

  ngOnInit(): void {
    this.loadLeaderboard();
    
    this.donationService.donationsUpdated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadLeaderboard();
      });
  }

  /*loadLeaderboard(): void {
    this.leaderboardService.getTopDonors(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.topDonors = response.content.map((item: any, index: number) => ({
          email: item.email,
          points: item.points,
          totalDonated: item.totalDonated,
          position: (this.currentPage * this.pageSize) + index + 1,
          isDonatorOfTheMonth: item.points >= 500
        }));
        this.totalElements = response.totalElements;
      },
      error: (err) => console.error('Erreur:', err)
    });
  }*/
    loadLeaderboard(): void {
      this.leaderboardService.getTopDonors(this.currentPage, this.pageSize).subscribe({
        next: (response) => {
          console.log('API Response:', response); // Log the full response for debugging
          
          this.topDonors = response.content.map((item: any, index: number) => {
            const donorData = {
              email: item.email,
              points: item.points || 0,
              totalDonated: item.totalDonated || 0,
              position: (this.currentPage * this.pageSize) + index + 1,
              isDonatorOfTheMonth: item.totalDonated >= 500
            };
    
            console.log(`Processed Donor ${index + 1}:`, donorData); // Log individual donor data
            return donorData;
          });
    
          this.totalElements = response.totalElements;
          console.log('Total Donors:', this.totalElements); // Log total donors
        },
        error: (err) => {
          console.error('Error Fetching Leaderboard Data:', err); // Log errors
        }
      });
    }
    
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}