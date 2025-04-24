import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RecommendationServiceService {

  private viewedProducts: { id: number, genderProduct: string, categoryProduct: string }[] = [];

  addViewedProduct(product: { id: number, genderProduct: string, categoryProduct: string }) {
    this.viewedProducts.push(product);
    console.log('Viewed Products:', this.viewedProducts);
  }

  getLastViewedProduct() {
    return this.viewedProducts.length > 0 ? this.viewedProducts[this.viewedProducts.length - 1] : null;
  }}
