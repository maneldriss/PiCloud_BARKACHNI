import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/productService/product.service';

@Component({
  selector: 'app-women-shop',
  templateUrl: './women-shop.component.html',
  styleUrls: ['./women-shop.component.css']
})
export class WomenShopComponent implements OnInit {
products: Product[] = [];
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];
  selectedCategories: string[] = [];
  staticCategories: string[] = ['PANTS','TOP','JACKET','DRESS','SKIRT','BAG','ACCESSORIES','SHOES'];
  staticSizes: string[] = ['XXS','XS','S','M','L','XL'];

  showSidebar: boolean = false;
  searchTerm = '';
  selectedCategory: string[] = [];
  selectedSize: string[] = [];
  minPrice: number | null = null;
  maxPrice: number | null = null;

  loading = true;
  error = '';

  // Pagination variables
  pageSize = 5;
  currentPage = 0;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadProducts();

  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data.filter(
          p => p.genderProduct?.toLowerCase() === 'women' || p.genderProduct?.toLowerCase() === 'unisex'
        );
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load products. Please try again later.';
        this.loading = false;
        console.error(err);
      }
    });
  }
  
  toggleSidebar(): void {
    this.showSidebar = !this.showSidebar;  }
  onCategoryChange(event: Event, category: string): void {
      const inputElement = event.target as HTMLInputElement;
  
      if (inputElement.checked) {
        this.selectedCategory.push(category);  // Add category to the selected array
      } else {
        this.selectedCategory = this.selectedCategory.filter(item => item !== category);  // Remove category from the array
      }
  
      // Apply filters after category change
      this.applyFilters();
    }
    onSizeChange(event: Event, size: string): void {
      const inputElement = event.target as HTMLInputElement;
  
      if (inputElement.checked) {
        this.selectedSize.push(size);  
      } else {
        this.selectedSize = this.selectedSize.filter(item => item !== size); 
      }
  
      // Apply filters after category change
      this.applyFilters();
    }
    applyFilters(): void {
      // Filter products by category and other criteria
     this.filteredProducts = this.products.filter(product => {
       // Check if selectedCategory is empty or if the product matches any selected category
       const categoryMatches = this.selectedCategory.length === 0 || this.selectedCategory.includes(product.categoryProduct ?? '');
       const sizeMatches = this.selectedSize.length === 0 || this.selectedSize.includes(product.productSize ?? '');
       const searchTermMatches = product.nameProduct.toLowerCase().includes(this.searchTerm.toLowerCase());
       const priceMatches = (product.productPrice ?? 0) >= (this.minPrice ?? 0) && (product.productPrice ?? 0) <= (this.maxPrice ?? Infinity);
   
       return categoryMatches && searchTermMatches && priceMatches && sizeMatches;
      });
     }
  
deleteProduct(id: number | undefined): void {
  if (!id) {
    this.error = 'Cannot delete product with undefined ID.';
    return;
  }
  
  if (confirm('Are you sure you want to delete this product?')) {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.loadProducts();
      },
      error: (err) => {
        this.error = 'Failed to delete product. Please try again later.';
        console.error(err);
      }
    });
  }
}
}
