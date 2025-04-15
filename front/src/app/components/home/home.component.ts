import { Component, OnInit } from '@angular/core';

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
    { name: 'Women', image: 'assets/img/categories/women.jpg', slug: 'women' },
    { name: 'Men', image: 'assets/img/categories/men.jpg', slug: 'men' },
    { name: 'Accessories', image: 'assets/img/categories/accessories.jpg', slug: 'accessories' },
    { name: 'Footwear', image: 'assets/img/categories/footwear.jpg', slug: 'footwear' }
  ];

  // Featured products
  featuredProducts = [
    { 
      name: 'Premium Denim Jacket', 
      image: 'assets/img/products/product-1.jpg', 
      price: 89.99,
      oldPrice: 120.00,
      badge: 'Sale'
    },
    { 
      name: 'Silk Summer Dress', 
      image: 'assets/img/products/product-2.jpg', 
      price: 65.50,
      badge: 'New'
    },
    { 
      name: 'Leather Crossbody Bag', 
      image: 'assets/img/products/product-3.jpg', 
      price: 75.00
    },
    { 
      name: 'Classic White Sneakers', 
      image: 'assets/img/products/product-4.jpg', 
      price: 59.99
    }
  ];

  // Instagram feed
  instagramPosts = [
    { image: 'assets/img/instagram/insta-1.jpg' },
    { image: 'assets/img/instagram/insta-2.jpg' },
    { image: 'assets/img/instagram/insta-3.jpg' },
    { image: 'assets/img/instagram/insta-4.jpg' },
    { image: 'assets/img/instagram/insta-5.jpg' },
    { image: 'assets/img/instagram/insta-6.jpg' }
  ];

  constructor() { }

  ngOnInit(): void {
    // Auto-rotate slides every 5 seconds
    setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  // Slider navigation methods
  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  // Go to specific slide
  goToSlide(index: number): void {
    this.currentSlide = index;
  }
}