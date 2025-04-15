import { Component, OnInit } from '@angular/core';
import { AdService } from '../../../services/ad.service';

declare var $: any; // For jQuery modal

@Component({
  selector: 'app-ad-management',
  templateUrl: './ad-management.component.html',
  styleUrls: ['./ad-management.component.css']
})
export class AdManagementComponent {
  pendingAds: any[] = [];
  selectedAd: any;
  rejectionReason = '';
  showRejectModal = false;
  isLoading = true; // Add loading state
  errorMessage = ''; // Add error handling

  constructor(private adService: AdService) {}

  ngOnInit() {
    this.loadPendingAds();
  }

  loadPendingAds(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.adService.getPendingAds().subscribe({
      next: (ads) => {
        this.pendingAds = ads;
        this.isLoading = false;
        console.log('Loaded ads:', ads); // Debug log
      },
      error: (err) => {
        this.errorMessage = 'Failed to load ads. Please try again.';
        this.isLoading = false;
        console.error('Error loading ads:', err);
      }
    });
  }

  openApproveModal(ad: any) {
    this.selectedAd = ad;
    if (confirm(`Approve "${ad.title}"?`)) {
      this.approveAd();
    }
  }

  openRejectModal(ad: any) {
    this.selectedAd = ad;
    this.rejectionReason = '';
    this.showRejectModal = true; 
  }

  approveAd() {
    this.adService.approveAd(this.selectedAd.id).subscribe(() => {
      this.loadPendingAds();
    });
  }

  confirmReject() {
    this.adService.rejectAd(this.selectedAd.id).subscribe(() => {
        this.showRejectModal = false;
        this.loadPendingAds(); // Will refresh the list without the deleted ad
    });
}
  cancelReject() {
    this.showRejectModal = false;
    this.rejectionReason = '';
  }
  // In your component class
getFullLink(link: string): string {
  if (!link) return '#';
  if (link.startsWith('http://') || link.startsWith('https://')) {
    return link;
  }
  return `http://${link}`;
}
}