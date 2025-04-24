import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import * as L from 'leaflet';
import { RecommendationServiceService } from 'src/app/services/recommendation-service.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth/auth.service';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
  iconUrl: 'assets/leaflet/marker-icon.png',
  shadowUrl: 'assets/leaflet/marker-shadow.png'
});

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent {


  product?: Product;
  loading = false;
  error = '';
  map: any;
  recommendedProducts: Product[]=[];
  isCurrentUsersProduct:boolean=false;
  currentUserId: number |null=null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private recommendationService:RecommendationServiceService,
    private http:HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getCurrentUserId();
    this.loadProduct();
  }

  getCurrentUserId():void{
    this.currentUserId=this.authService.getCurrentUser()?.id ?? null;
  }
 
  loadProduct(): void {
    this.loading = true;
    const id = Number(this.route.snapshot.paramMap.get('id'));
  
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product = data;
        this.loading = false;

        this.isCurrentUsersProduct=this.product.productSeller?.id ===this.currentUserId;
  
        if (this.product?.productSeller?.latitude && this.product?.productSeller?.longitude) {
          // Wait for Angular to render the map div
          setTimeout(() => {
            this.initMap(
              this.product!.productSeller!.latitude,
              this.product!.productSeller!.longitude
            );
          }, 0);
        }
        this.loadRecommendations();
      },
      error: (err) => {
        console.error('Erreur complète :', err);
        this.error = 'Échec du chargement';
        this.loading = false;
      }
    });
  }
  
  //recommendation sans embedding
  loadRecommendations(): void {
    const lastViewed = this.recommendationService.getLastViewedProduct();
    
    if (lastViewed && this.product?.productId !== undefined) {
      this.productService.recommendProducts(
        lastViewed.genderProduct,
        lastViewed.categoryProduct,
        this.product.productId
      ).subscribe({
        next: (data) => {
          this.recommendedProducts = data;
        },
        error: (err) => {
          console.error('Erreur lors du chargement des recommandations :', err);
        }
      });
    }
  }
  goBack(): void {
    this.router.navigate(['/products']);
  }

  
  initMap(lat: number, lon: number): void {
    this.map = L.map('map').setView([lat, lon], 13);
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  
    L.marker([lat, lon])
      .addTo(this.map)
      .bindPopup('Seller Location')
      .openPopup();
  }
  
  
  deleteProduct(id: number | undefined): void {
    if (!id) {
      this.error = 'Cannot delete product with undefined ID.';
      return;
    }
    
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.router.navigate(['/products']); 
          
        },
        error: (err) => {
          this.error = 'Failed to delete product. Please try again later.';
          console.error(err);
        }
      });
    }
  }


}


