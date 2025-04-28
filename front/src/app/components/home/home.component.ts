import { Component, OnInit } from '@angular/core';
import { AdService } from 'src/app/services/ad.service';
import { Ad } from 'src/app/models/ad';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  // Slider configuration
  currentSlide = 0;
  slides = [
    {
      image: 'assets/img/hero-1.jpg',
      title: 'Summer Collection',
      description: 'Discover our curated selection of premium fashion essentials',
      link: '/shop/summer'
    },
    {
      image: 'assets/img/hero-2.jpg',
      title: 'Winter Essentials',
      description: 'Stay warm in style with our latest arrivals',
      link: '/shop/winter'
    }
  ];

  // Categories grid
  categories = [
    { name: 'Women', image: 'women.jpg', slug: 'women' },
    { name: 'Men', image: 'men.jpg', slug: 'men' },
    { name: 'Accessories', image: 'accessories.jpg', slug: 'accessories' },
    { name: 'Footwear', image: 'footwear.jpg', slug: 'footwear' }
  ];

  // Featured products
  featuredProducts = [
    { 
      name: 'Premium Denim Jacket', 
      image: 'product-1.jpg', 
      price: 89.99,
      oldPrice: 120.00,
      badge: 'Sale'
    },
    { 
      name: 'Silk Summer Dress', 
      image: 'product-2.jpg', 
      price: 65.50,
      badge: 'New'
    },
    { 
      name: 'Leather Crossbody Bag', 
      image: 'product-3.jpg', 
      price: 75.00
    },
    { 
      name: 'Classic White Sneakers', 
      image: 'product-4.jpg', 
      price: 59.99
    }
  ];

  // Instagram feed
  instagramPosts = [
    { image: 'insta-1.jpg' },
    { image: 'insta-2.jpg' },
    { image: 'insta-3.jpg' },
    { image: 'insta-4.jpg' },
    { image: 'insta-5.jpg' },
    { image: 'insta-6.jpg' }
  ];

  // Brand ads properties
  brandAds: any[] = []; // Temporary 'any' type to bypass issues
  loading = true;
  error = false;

  constructor(private adService: AdService) { }

  ngOnInit(): void {
    this.loadAds();
  }

  loadAds(): void {
    this.adService.getApprovedHomepageAds().subscribe({
      next: (ads) => {
        console.log('Ads received:', ads); // Debug
        this.brandAds = ads;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading ads:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  trackAdClick(adId: number | undefined): void {
    if (adId === undefined) {
      console.warn('Cannot track click - ad ID is missing');
      return;
    }
    this.adService.incrementAdClicks(adId).subscribe({
      error: (err) => console.error('Error tracking click:', err)
    });
  }

  // Slider navigation methods
  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }
  fixUrl(url: string): string {
    if (!url.match(/^https?:\/\//)) {
      return 'https://' + url;
    }
    return url;
  }
}