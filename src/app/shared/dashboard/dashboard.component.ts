import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ProductService } from 'src/app/productService/product.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  allProducts: any[] = [];

  productForm: any = {
    title: '',
    price: 0,
    description: '',
    category: '',
    genderProduct: '',
    image: ''
  };

  selectedProduct: any = null;

  @ViewChild('productFormRef') productFormRef!: NgForm;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts(): void {
    this.productService.getProducts().subscribe((products: any[]) => {
      this.allProducts = products;
    });
  }

  addProduct(): void {
    this.productService.addProduct(this.productForm).subscribe(() => {
      this.getAllProducts();
      this.productFormRef.resetForm();
    });
  }

  editProduct(product: any): void {
    this.selectedProduct = { ...product };
    this.productForm = { ...product };
  }

  updateProduct(): void {
    if (this.selectedProduct && this.selectedProduct.id) {
      this.productService.updateProduct(this.selectedProduct.id, this.productForm).subscribe(() => {
        this.getAllProducts();
        this.cancelEdit();
      });
    }
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe(() => {
        this.getAllProducts();
      });
    }
  }

  cancelEdit(): void {
    this.selectedProduct = null;
    this.productFormRef.resetForm();
  }
}

