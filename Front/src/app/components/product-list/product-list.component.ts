import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { CartService } from 'src/app/services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  cartId = 1; // You can update this based on the logged-in user/session

  constructor(
    private productService: ProductService,
    private cartService: CartService,  private router: Router
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.productService.getAllProducts().subscribe((data) => {
      this.products = data;
    });
  }

  addToCart(productId: number): void {
    const quantity = 1; // default for now
    this.cartService.addProductToCart(this.cartId, productId, quantity).subscribe(() => {
      this.router.navigate(['/cart']);
    });
  }
}

