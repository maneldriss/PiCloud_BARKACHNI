import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/productService/product.service';
import { RecommendationService } from 'src/app/recommendationService/recommendation.service';

@Component({
  selector: 'app-kids-shops',
  templateUrl: './kids-shops.component.html',
  styleUrls: ['./kids-shops.component.css']
})
export class KidsShopsComponent implements OnInit{
products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedCategories: string[] = [];
  staticSizes: string[] = ['XXS','XS','S','M','L','XL'];
  staticCategories: string[] = ['PANTS','TOP','JACKET','DRESS','SKIRT','BAG','ACCESSORIES','SHOES'];
  showSidebar: boolean = false;
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
 paginatedProducts: Product[] = [];

  constructor(private productService: ProductService,private recommendationService: RecommendationService) { }

  ngOnInit(): void {
    this.loadProducts();

  }

  applyFilters(): void {
    // Filter products by category and other criteria
    this.filteredProducts = this.products.filter(product => {
      // Check if selectedCategory is empty or if the product matches any selected category
      const categoryMatches = this.selectedCategory.length === 0 || 
                            this.selectedCategory.includes(product.categoryProduct ?? '');
      const sizeMatches = this.selectedSize.length === 0 || 
                         this.selectedSize.includes(product.productSize ?? '');
      const searchTermMatches = product.nameProduct.toLowerCase().includes(this.searchTerm.toLowerCase());
      const priceMatches = (product.productPrice ?? 0) >= (this.minPrice ?? 0) && 
                          (product.productPrice ?? 0) <= (this.maxPrice ?? Infinity);
  
      return categoryMatches && searchTermMatches && priceMatches && sizeMatches;
    });
    
    // Reset to first page and update paginated products
    this.currentPage = 0;
    this.updatePaginatedProducts();
  }
  
  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data.filter(
          p => p.genderProduct?.toUpperCase() === 'KIDS'
        );
        this.applyFilters(); // This will now call updatePaginatedProducts()
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
// Pagination methods

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
  
  // Always show first page
  if (totalPages > 0) pages.push(0);
  
  // Calculate range around current page
  let start = Math.max(1, this.currentPage - Math.floor(this.maxVisiblePages / 2));
  let end = Math.min(totalPages - 1, start + this.maxVisiblePages - 1);
  
  // Adjust if we're at the end
  start = Math.max(1, end - this.maxVisiblePages + 1);
  
  // Add pages in range
  for (let i = start; i <= end; i++) {
    if (i > 0 && i < totalPages - 1) {
      pages.push(i);
    }
  }
  
  // Always show last page if there's more than one page
  if (totalPages > 1) pages.push(totalPages - 1);
  
  return pages;
}
//reservation purposes
reserveProduct(id: number) {
  this.productService.reserveProduct(id).subscribe({
    next: data => {
      this.products = data;
      this.loadProducts();
    },
    error: err => alert('Reservation failed: ' + err.error.message)
  });
  
}
//recommendation purposes
onProductClick(product: any) {
  this.recommendationService.addViewedProduct({
    id: product.productId,
    genderProduct: product.genderProduct,
    categoryProduct: product.categoryProduct
  });

  console.log('Product clicked:', product);

}
}
