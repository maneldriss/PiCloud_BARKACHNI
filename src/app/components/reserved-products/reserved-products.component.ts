import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/productService/product.service';

@Component({
  selector: 'app-reserved-products',
  templateUrl: './reserved-products.component.html',
  styleUrls: ['./reserved-products.component.css']
})
export class ReservedProductsComponent implements OnInit {
  reservedProducts: any[] = [];
  error: string = '';
  loading: boolean = false;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadReservedProducts();
  }

  loadReservedProducts(): void {
    this.loading = true;
    this.productService.getReservedProducts().subscribe({
      next: (data) => {
        this.reservedProducts = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading reserved products', err);
        this.error = 'Failed to load reserved products';
        this.loading = false;
      }
    });
  }

  unreserveProduct(productId: number): void {
    console.log('Unreserving product with ID:', productId);
    this.productService.unreserveProduct(productId).subscribe({
      next: () => {
        this.loadReservedProducts(); // Reload the list of reserved products after unreserving
      },
      error: (err) => {
        console.error('Error unreserving product', err);
        this.error = 'Failed to unreserve the product';
      }
    });
  }
 
  calculateTimeRemaining(deadline: string): string {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const timeDifference = deadlineDate.getTime() - now.getTime();
    const hoursRemaining = Math.floor(timeDifference / (1000 * 3600));
    const minutesRemaining = Math.floor((timeDifference % (1000 * 3600)) / (1000 * 60));
    if (timeDifference > 0) {
      return `${hoursRemaining} hours and ${minutesRemaining} minutes remaining`;
    } else {
      return 'Deadline passed';
    }
  }

}
