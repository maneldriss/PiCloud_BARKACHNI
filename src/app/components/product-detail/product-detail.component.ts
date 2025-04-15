import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/productService/product.service';
import * as L from 'leaflet';
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadProduct();
  }

 
  loadProduct(): void {
    this.loading = true;
    const id = Number(this.route.snapshot.paramMap.get('id'));
  
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product = data;
        this.loading = false;
  
        if (this.product.productSeller?.latitude && this.product.productSeller?.longitude) {
          // Wait for Angular to render the map div
          setTimeout(() => {
            this.initMap(
              this.product!.productSeller!.latitude,
              this.product!.productSeller!.longitude
            );
          }, 0);
        }
      },
      error: (err) => {
        console.error('Erreur complète :', err);
        this.error = 'Échec du chargement';
        this.loading = false;
      }
    });
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
  
  



}


