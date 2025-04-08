import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Donation } from 'src/app/models/donation';
import { DonationService } from 'src/app/services/donation.service';

@Component({
  selector: 'app-donation-detail',
  templateUrl: './donation-detail.component.html',
  styleUrls: ['./donation-detail.component.css']
})
export class DonationDetailComponent implements OnInit {
  donation?: Donation;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private donationService: DonationService
  ) {}

  ngOnInit(): void {
    this.loadDonation();
  }

 /* loadDonation(): void {
    this.loading = true;
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    this.donationService.getDonationById(id).subscribe({
      next: (data) => {
        this.donation = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load donation details';
        this.loading = false;
        console.error(err);
      }
    });
  }*/
    // donation-detail.component.ts
loadDonation(): void {
  this.loading = true;
  const id = Number(this.route.snapshot.paramMap.get('id'));
  
  console.log('ID récupéré :', id); // Debug 1
  
  this.donationService.getDonationById(id).subscribe({
    next: (data) => {
      console.log('Donation reçue :', data); // Debug 2
      this.donation = data;
      this.loading = false;
    },
    error: (err) => {
      console.error('Erreur complète :', err); // Debug 3
      this.error = 'Échec du chargement';
      this.loading = false;
    }
  });
}
  goBack(): void {
    this.router.navigate(['/donations']);
  }
}