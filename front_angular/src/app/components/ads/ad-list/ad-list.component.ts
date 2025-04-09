import { Component, OnInit } from '@angular/core';
import { Ad } from '../../../models/ad';
import { AdService } from '../../../services/ad.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { BrandService } from '../../../services/brand.service';
import { Brand } from '../../../models/brand';

@Component({
  selector: 'app-ad-list',
  templateUrl: './ad-list.component.html',
  styleUrls: ['./ad-list.component.css']
})
export class AdListComponent implements OnInit {
  ads: Ad[] = [];
  filteredAds: Ad[] = [];
  loading = true;
  error = '';
  searchTerm = '';
  selectedBrandId: number | null = null;
  brands: Brand[] = [];

  constructor(
    private adService: AdService,
    private brandService: BrandService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAds();
    this.loadBrands();
  }

  loadAds(): void {
    this.loading = true;
    this.adService.getAllAds().subscribe({
      next: (ads) => {
        this.ads = ads;
        this.filteredAds = [...ads];
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.error = 'Failed to load ads. Please try again later.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  loadBrands(): void {
    this.brandService.getAllBrands().subscribe({
      next: (brands) => {
        this.brands = brands;
      },
      error: (err) => {
        console.error('Failed to load brands', err);
      }
    });
  }

  searchAds(): void {
    this.filteredAds = this.ads.filter(ad => {
      const matchesSearch = ad.title.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
                          (ad.description && ad.description.toLowerCase().includes(this.searchTerm.toLowerCase()));
      const matchesBrand = this.selectedBrandId ? ad.brand?.id === this.selectedBrandId : true;
      return matchesSearch && matchesBrand;
    });
  }

  deleteAd(id: number): void {
    if (confirm('Are you sure you want to delete this ad?')) {
      this.adService.deleteAd(id).subscribe({
        next: () => {
          this.ads = this.ads.filter(ad => ad.id !== id);
          this.filteredAds = this.filteredAds.filter(ad => ad.id !== id);
        },
        error: (err: HttpErrorResponse) => {
          this.error = 'Failed to delete ad. Please try again.';
          console.error(err);
        }
      });
    }
  }

  viewAdDetails(id: number): void {
    this.router.navigate(['/ads', id]);
  }

  editAd(id: number): void {
    this.router.navigate(['/ads/edit', id]);
  }

  createNewAd(): void {
    this.router.navigate(['/ads/add']);
  }

  trackByAdId(index: number, ad: Ad): number {
    return ad.id!;
  }
}