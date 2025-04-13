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
    private donationService: DonationService,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.loadDonation();
  }

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
  
  refreshDonation(): void {
    this.loadDonation();
  }
 
updateDonation(): void {
  if (!this.donation) return;

  this.loading = true;
  this.donationService.updateDonation(this.donation).subscribe({
    next: () => {
      this.donationService.notifyUpdates();
      
      this.router.navigate(['/donations'], {
        state: { refreshed: true }
      });
    },
    error: (err) => {
      this.error = 'Échec de la mise à jour';
      this.loading = false;
    }
  });
}
}