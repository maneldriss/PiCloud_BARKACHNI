import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../productService/product.service';
import { UserService } from '../../userService/user.service'; 
import { User } from '../../models/user';
import { HttpClient } from '@angular/common/http';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  productId?: number;
  loading = false;
  error = '';
  users: User[] = []; // Store users
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private userService: UserService, 
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.productForm = this.fb.group({
      nameProduct: ['', [Validators.required, Validators.pattern('^[A-Z].*')]],
      categoryProduct: ['', Validators.required],
      productSeller: [''],
      dateProductAdded: [new Date().toISOString().substring(0, 16)], // Default to now
      productImageURL: [''],
      productDescription: [''],
      productPrice: [0, [Validators.required, Validators.min(0.01), Validators.max(500)]],
      productState: [Validators.required]
    });
    
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  ngOnInit(): void {
    this.productId = +this.route.snapshot.params['productId'];
    this.isEditMode = !!this.productId;

    // Fetch existing users
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users; // Store users in array
      },
      error: (err) => {
        console.error('Failed to fetch users', err);
      }
    });

    if (this.isEditMode) {
      this.loading = true;
      this.productService.getProductById(this.productId!).subscribe({
        next: (product) => {
          this.productForm.patchValue(product);
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load product details.';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid) return;
    
    this.loading = true;
    const productData = this.productForm.value;
    
    // If there's an image, upload it first
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      this.http.post<{ fileName: string }>('http://localhost:8089/BarkachniPI/marketplace/upload-image', formData)
        .subscribe({
          next: (response) => {
            // Assuming response.fileName returns the uploaded file's name (e.g., "product1.jpg")
            const product: Product = {
              ...productData,
              productImageURL: 'http://localhost:8089/BarkachniPI/uploads/' + response.fileName 
            };

            // Now, submit the product to the backend
            this.productService.addProduct(product).subscribe({
              next: () => this.router.navigate(['/products']),
              error: (err) => {
                this.error = 'Failed to create product.';
                this.loading = false;
                console.error(err);
              }
            });
          },
          error: (err) => {
            console.error('Image upload error', err);  // Log the error details
            this.error = 'Image upload failed.';
            this.loading = false;
          }
        });

    } else {
      // No image selected, create product without image
      const product: Product = {
        ...productData,
        productImageURL: '' // You can set a default image if necessary
      };
      
      this.productService.addProduct(product).subscribe({
        next: () => this.router.navigate(['/products']),
        error: (err) => {
          this.error = 'Failed to create product.';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }
}
