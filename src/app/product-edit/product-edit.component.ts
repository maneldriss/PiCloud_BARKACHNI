import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../productService/product.service';
import { UserService } from '../userService/user.service';
import { Product } from '../models/product';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  form!: FormGroup;
  productId!: number;
  selectedFile: File | null = null;
  error = '';
  loading = false;
  originalSeller!: User; // To preserve original seller

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private http: HttpClient,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.productId = +this.route.snapshot.paramMap.get('id')!;
    this.loadProduct();
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  loadProduct(): void {
    this.productService.getProductById(this.productId).subscribe(product => {
      this.originalSeller = product.productSeller || {} as User; // Save original seller with fallback
      
      this.form = this.fb.group({
      nameProduct: [product.nameProduct, [Validators.required, Validators.pattern('^[A-Z].*')]],
      categoryProduct: [product.categoryProduct, Validators.required],
      dateProductAdded: [product.dateProductAdded, Validators.required],
      productImageURL: [product.productImageURL],
      productDescription: [product.productDescription, Validators.required],
      productPrice: [product.productPrice, [Validators.required, Validators.min(0.01), Validators.max(500)]],
      productState: [product.productState, Validators.required]
      });
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const updatedProduct: Product = {
        ...this.form.value,
        productSeller: this.originalSeller // Reuse original seller
      };

      if (this.selectedFile) {
        const formData = new FormData();
        formData.append('file', this.selectedFile);

        this.http.post<{ fileName: string }>('http://localhost:8089/BarkachniPI/marketplace/upload-image', formData)
          .subscribe({
            next: (response) => {
              updatedProduct.productImageURL = 'http://localhost:8089/BarkachniPI/uploads/' + response.fileName;

              // Now call the update method with the new image
              this.productService.updateProduct(updatedProduct, this.productId).subscribe(() => {
                this.router.navigate(['/products']);
              });
            },
            error: (err) => {
              console.error('Image upload failed', err);
              this.error = 'Image upload failed.';
            }
          });
      } else {
        // No image change, just update the product
        this.productService.updateProduct(updatedProduct, this.productId).subscribe(() => {
          this.router.navigate(['/products']);
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }
}
