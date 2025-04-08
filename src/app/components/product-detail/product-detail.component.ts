import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/productService/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent {


  product?: Product;
  loading = false;
  error = '';

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
  
  console.log('ID récupéré :', id); // Debug 1
  
  this.productService.getProductById(id).subscribe({
    next: (data) => {
      console.log('product reçue :', data); // Debug 2
      this.product = data;
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
    this.router.navigate(['/products']);
  }
}


