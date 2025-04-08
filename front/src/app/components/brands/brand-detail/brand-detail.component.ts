import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Brand } from '../../../models/brand';
import { Ad } from '../../../models/ad';
import { BrandService } from '../../../services/brand.service';
import { AdService } from '../../../services/ad.service';

@Component({
  selector: 'app-brand-detail',
  templateUrl: './brand-detail.component.html',
  styleUrls: ['./brand-detail.component.css']
})
export class BrandDetailComponent implements OnInit {
  brand: Brand | undefined;
  ads: Ad[] = [];
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private brandService: BrandService,
    private adService: AdService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'No brand ID provided';
      this.loading = false;
      return;
    }

    this.loadBrand(+id);
    this.loadBrandAds(+id);
  }

  loadBrand(id: number): void {
    this.brandService.getBrandById(id).subscribe({
      next: (brand) => {
        this.brand = brand;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load brand details';
        this.loading = false;
        console.error(err);
      }
    });
  }

  loadBrandAds(brandId: number): void {
    this.adService.findAdsByBrandId(brandId).subscribe({
      next: (ads) => {
        this.ads = ads;
      },
      error: (err) => {
        console.error('Failed to load brand ads', err);
      }
    });
  }

  deleteAd(adId: number | undefined): void {
    if (!adId) return;
    
    if (confirm('Are you sure you want to delete this ad?')) {
      this.adService.deleteAd(adId).subscribe({
        next: () => {
          this.ads = this.ads.filter(ad => ad.id !== adId);
        },
        error: (err) => {
          this.error = 'Failed to delete ad';
          console.error(err);
        }
      });
    }
  }

  navigateToEdit(): void {
    if (this.brand?.id) {
      this.router.navigate(['/brands/edit', this.brand.id]);
    }
  }
  getStarClass(star: number): string {
    if (!this.brand || this.brand.rating === undefined) return 'bi-star';
    return star <= this.brand.rating ? 'bi-star-fill text-warning' : 'bi-star';
  }
  imageError = false;
defaultLogo = 'assets/images/default-brand.png';

handleImageError(event: Event) {
  this.imageError = true;
  console.log('Image load error - switching to default logo');
}
}