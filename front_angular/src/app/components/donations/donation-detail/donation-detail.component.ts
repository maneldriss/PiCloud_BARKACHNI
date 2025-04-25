import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DonationService } from '../../../services/donation.service';
import { Donation } from 'src/app/models/donation';

@Component({
  selector: 'app-donation-detail',
  templateUrl: './donation-detail.component.html',
  styleUrls: ['./donation-detail.component.css']
})
export class DonationDetailComponent implements OnInit {
  donation: Donation | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private donationService: DonationService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.loading = true;
      this.donationService.getDonationById(id).subscribe({
        next: (donation) => {
          this.donation = donation;
          this.loading = false;
        },
        error: (err) => {
          this.error = err.message || 'Failed to load donation details';
          this.loading = false;
          console.error('Error details:', err);
        }
      });
    } else {
      this.error = 'No donation ID provided';
      this.loading = false;
    }
  }

  getDonationTypeDisplay(type: string): string {
    // Implémentez cette méthode selon vos besoins
    return type === 'MONEY' ? 'Financial Donation' : 'Clothing Donation';
  }

  goBack(): void {
    this.router.navigate(['/donations']);
  }
}