// homepage-ad.component.ts
import { Component } from '@angular/core';
import { AdService } from '../../services/ad.service';
import { Ad } from '../../models/ad';

@Component({
  selector: 'app-homepage-ad',
  template: `
    <div class="approved-ads-section">
      <h2>Featured Brands</h2>
      
      <div *ngIf="loading; else content" class="loading">
        Loading featured brands...
      </div>

      <ng-template #content>
        <div *ngIf="error; else adsContent" class="error">
          {{ error }}
        </div>

        <ng-template #adsContent>
          <div *ngIf="ads.length > 0; else noAds" class="ads-grid">
            <div *ngFor="let ad of ads" class="ad-card">
              <div class="ad-image-container">
                <img [src]="ad.image" [alt]="ad.title" class="ad-image">
              </div>
              <div class="ad-content">
                <h3>{{ ad.title }}</h3>
                <p class="ad-description" *ngIf="ad.description">{{ ad.description }}</p>
                <div class="ad-brand" *ngIf="ad.brand">
                  <img [src]="ad.brand.logo" [alt]="ad.brand.name" class="brand-logo" *ngIf="ad.brand.logo">
                  <span class="brand-name">{{ ad.brand.name }}</span>
                </div>
                <a [href]="ad.link" target="_blank" class="ad-link" (click)="trackAdClick(ad.id!)">
                  Learn More
                </a>
              </div>
            </div>
          </div>

          <ng-template #noAds>
            <div class="no-ads">
              No featured brands available
            </div>
          </ng-template>
        </ng-template>
      </ng-template>
    </div>
  `,
  styleUrls: ['./homepage-ad.component.css']
})
export class HomepageAdComponent {
  ads: Ad[] = [];
  loading = true;
  error = '';

  constructor(private adService: AdService) {}

  ngOnInit(): void {
    this.loadApprovedAds();
  }

  loadApprovedAds(): void {
    this.loading = true;
    this.error = '';
    
    this.adService.getApprovedHomepageAds().subscribe({
      next: (ads) => {
        this.ads = ads;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load featured brands. Please try again later.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  trackAdClick(adId: number): void {
    this.adService.incrementAdClicks(adId).subscribe({
      error: (err) => console.error('Error tracking click:', err)
    });
  }
}