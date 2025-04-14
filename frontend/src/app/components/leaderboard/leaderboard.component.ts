import { Component, OnInit } from '@angular/core';
import { LeaderboardServiceService } from 'src/app/services/leaderboard-service.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css'],
  
})
export class LeaderboardComponent implements OnInit {
  topDonors: any[] = [];
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalItems = 0;
  displayedColumns: string[] = ['position', 'email', 'points', 'totalDonated'];

  constructor(private leaderboardService: LeaderboardServiceService) {}

  ngOnInit(): void {
    this.loadLeaderboard();
  }

 // leaderboard.component.ts
 loadLeaderboard(): void {
  this.leaderboardService.getTopDonors(this.currentPage, this.pageSize).subscribe({
    next: (response) => {
      console.log('Réponse complète:', response);
      this.topDonors = response.content.map((item: any, index: number) => {
        console.log('Donateur:', item); // Debug détaillé
        return {
          email: item.email,
          points: item.points,
          totalDonated: item.totalDonated,
          position: (this.currentPage * this.pageSize) + index + 1
        };
      });
      this.totalElements = response.totalElements;
    },
    error: (err) => console.error('Erreur:', err)
  });
}

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadLeaderboard();
  }
}