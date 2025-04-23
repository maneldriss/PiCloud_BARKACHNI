import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../productService/product.service';

@Component({
  selector: 'app-my-products',
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.css']
})
export class MyProductsComponent implements OnInit {
  // Reuse the same properties as ProductListComponent
  products: Product[] = [];
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];
  showSidebar: boolean = false;

  staticCategories: string[] = ['PANTS','TOP','JACKET','DRESS','SKIRT','BAG','ACCESSORIES','SHOES'];
  staticSizes: string[] = ['XXS','XS','S','M','L','XL'];

  searchTerm = '';
  selectedCategory: string[] = [];
  selectedSize: string[] = [];

  minPrice: number | null = null;
  maxPrice: number | null = null;

  loading = true;
  error = '';

  // Pagination variables
  pageSize = 8; 
  currentPage = 0; 
  maxVisiblePages = 5; 

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadMyProducts();
  }

  loadMyProducts(): void {
    this.loading = true;
    // For testing purposes, we'll hardcode user ID 1
    const testUserId = 1;
    
    this.productService.retrieveProductsBySellerId(testUserId).subscribe({
      next: (data) => {
        this.products = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load your products. Please try again later.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  // Reuse all the same filter and pagination methods from ProductListComponent
  toggleSidebar(): void {
    this.showSidebar = !this.showSidebar;
  }

  onCategoryChange(event: Event, category: string): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.checked) {
      this.selectedCategory.push(category);
    } else {
      this.selectedCategory = this.selectedCategory.filter(item => item !== category);
    }
    this.applyFilters();
  }

  onSizeChange(event: Event, size: string): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.checked) {
      this.selectedSize.push(size);
    } else {
      this.selectedSize = this.selectedSize.filter(item => item !== size);
    }
    this.applyFilters();
  }
    
  applyFilters(): void {
    this.filteredProducts = this.products.filter(product => {
      const categoryMatches = this.selectedCategory.length === 0 || this.selectedCategory.includes(product.categoryProduct ?? '');
      const sizeMatches = this.selectedSize.length === 0 || this.selectedSize.includes(product.productSize ?? '');
      const searchTermMatches = product.nameProduct.toLowerCase().includes(this.searchTerm.toLowerCase());
      const priceMatches = (product.productPrice ?? 0) >= (this.minPrice ?? 0) && (product.productPrice ?? 0) <= (this.maxPrice ?? Infinity);

      return categoryMatches && searchTermMatches && priceMatches && sizeMatches;
    });
    this.currentPage = 0;
    this.updatePaginatedProducts();
  }

  // Pagination methods (same as ProductListComponent)
  getTotalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.pageSize);
  }

  updatePaginatedProducts(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.getTotalPages()) {
      this.currentPage = page;
      this.updatePaginatedProducts();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.getTotalPages() - 1) {
      this.currentPage++;
      this.updatePaginatedProducts();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updatePaginatedProducts();
    }
  }

  getPages(): number[] {
    const totalPages = this.getTotalPages();
    const pages: number[] = [];
    
    if (totalPages > 0) pages.push(0);
    
    let start = Math.max(1, this.currentPage - Math.floor(this.maxVisiblePages / 2));
    let end = Math.min(totalPages - 1, start + this.maxVisiblePages - 1);
    
    start = Math.max(1, end - this.maxVisiblePages + 1);
    
    for (let i = start; i <= end; i++) {
      if (i > 0 && i < totalPages - 1) {
        pages.push(i);
      }
    }
    
    if (totalPages > 1) pages.push(totalPages - 1);
    
    return pages;
  }
}