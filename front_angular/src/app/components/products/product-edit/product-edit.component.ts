import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user/user.service';
import { Product } from 'src/app/models/product';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
    private apiUrl = `${environment.apiUrl}`;
  
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
  //sizing and fit
  productGenders: string[] = ['MEN', 'WOMEN', 'KIDS', 'UNISEX'];
  allSizes: string[] = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];
  allCategories: string[] = ['PANTS','TOP','JACKET','DRESS','SKIRT','BAG','ACCESSORIES','SHOES'];
  filteredSizes: string[] = [];

  selectedGender: string = '';
  selectedSize: string = '';
  selectedCategory: string = '';

  //size sidebar related
  showSizeGuide: boolean = false;
  sizeMessage: string | null = null;


sizeGuideInputs: any = {
  height: null,
  chest: null,
  waist: null,
  bust: null,
  hips: null,
  neck: null,
  inSeam: null,
};
// sizing functions: men women kids
checkWomenSize() {
  const bust = this.sizeGuideInputs.bust;
  const waist = this.sizeGuideInputs.waist;
  const hips = this.sizeGuideInputs.hips;

  if (bust >= 75 && bust <= 82 && waist >= 57 && waist <= 64 && hips >= 84 && hips <= 91) {
    this.sizeMessage = 'Your size is XXS';
  } else if (bust >= 83 && bust <= 87 && waist >= 65 && waist <= 69 && hips >= 92 && hips <= 96) {
    this.sizeMessage = 'Your size is XS';
  } else if (bust >= 88 && bust <= 92 && waist >= 70 && waist <= 74 && hips >= 97 && hips <= 101) {
    this.sizeMessage = 'Your size is S';
  } else if (bust >= 93 && bust <= 97 && waist >= 75 && waist <= 79 && hips >= 102 && hips <= 106) {
    this.sizeMessage = 'Your size is M';
  } else if (bust >= 98 && bust <= 102 && waist >= 80 && waist <= 84 && hips >= 107 && hips <= 111) {
    this.sizeMessage = 'Your size is L';
  } else if (bust >= 103 && bust <= 108 && waist >= 85 && waist <= 90 && hips >= 112 && hips <= 117) {
    this.sizeMessage = 'Your size is XL';
  } else {
    this.sizeMessage = "Please check the measurements again";
  }
}
checkMenTopSize() {
  const neck = this.sizeGuideInputs.neck;
  const waist = this.sizeGuideInputs.waist;
  const chest = this.sizeGuideInputs.chest;

  if (neck == 34 && waist == 72 && chest == 87) {
    this.sizeMessage = 'Your size is XXS';
  } else if (neck == 36 && waist == 77 && chest == 92) {
    this.sizeMessage = 'Your size is XS';
  } else if (neck == 38 && waist == 82 && chest == 97) {
    this.sizeMessage = 'Your size is S';
  } else if (neck == 40 && waist == 87 && chest == 102) {
    this.sizeMessage = 'Your size is M';
  } else if (neck == 42 && waist == 92 && chest ==107) {
    this.sizeMessage = 'Your size is L';
  } else if (neck == 44 && waist == 97 && chest == 112) {
    this.sizeMessage = 'Your size is XL';
  } else {
    this.sizeMessage = "Please check the measurements again";
  }
}
checkMenButtomSize() {
  const waist = this.sizeGuideInputs.waist;
  const inSeam = this.sizeGuideInputs.inSeam;

  if (waist == 72 && inSeam == 80) {
    this.sizeMessage = 'Your size is XXS';
  } else if (waist == 77 && inSeam == 81) {
    this.sizeMessage = 'Your size is XS';
  } else if (waist == 82 && inSeam == 81) {
    this.sizeMessage = 'Your size is S';
  } else if (waist == 87 && inSeam == 82) {
    this.sizeMessage = 'Your size is M';
  } else if (waist == 92 && inSeam == 82) {
    this.sizeMessage = 'Your size is L';
  } else if (waist == 97 && inSeam == 83) {
    this.sizeMessage = 'Your size is XL';
  } else {
    this.sizeMessage = "Please check the measurements again";
  }
}
checkKidsSize() {
  const height = this.sizeGuideInputs.height;
  const waist = this.sizeGuideInputs.waist;
  const chest = this.sizeGuideInputs.chest;

  if (height >= 99 && height <= 110 && waist >= 53 && waist <= 55.5 && chest >= 55.5 && chest <= 59) {
    this.sizeMessage = 'Your size is XS';
  } else if (height >= 111 && height <= 128 && waist >= 56 && waist <=61 && chest >= 59.5 && chest <= 66) {
    this.sizeMessage = 'Your size is S';
  } else if (height >= 129 && height <= 152 && waist >= 61.5 && waist <= 71 && chest >= 66.5 && chest <= 78) {
    this.sizeMessage = 'Your size is M';
  } else if (height >= 153 && height <= 170 && waist >= 71.5 && waist <= 77.5 && chest >= 78.5 && chest <= 89) {
    this.sizeMessage = 'Your size is L';
  } else {
    this.sizeMessage = "Please check the measurements again";
  }
}

//end sizing functions
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
      genderProduct: [product.genderProduct, Validators.required],
      productSize: [product.productSize, Validators.required],
      dateProductAdded: [product.dateProductAdded, Validators.required],
      productImageURL: [product.productImageURL],
      productDescription: [product.productDescription, Validators.required],
      productPrice: [product.productPrice, [Validators.required, Validators.min(0.01), Validators.max(500)]],
      productState: [product.productState, Validators.required],
      height: [''],
      chest: [''],
      waist: [''],
      bust: [''],
      hips: [''],
      neck: [''],
      inSeam: ['']
      });
    });
  }
//sizing related
onGenderChange() {
  this.selectedGender = this.form.get('genderProduct')?.value;

  // Size filtering logic
  if (this.selectedGender === 'KIDS') {
    this.filteredSizes = ['XS', 'S', 'M', 'L'];
  } else {
    this.filteredSizes = this.allSizes;
  }
  this.updateSizeGuideInputs(); 


}
//size sidebar related
toggleSizeGuide() {
  this.showSizeGuide = !this.showSizeGuide;
}
onCategoryChange() {
  this.selectedCategory = this.form.get('categoryProduct')?.value;
  this.updateSizeGuideInputs(); 
}

ensureControlExists(name: string) {
  if (!this.form.contains(name)) {
    this.form.addControl(name, new FormControl(null));
  }
}
updateSizeGuideInputs() {
  this.selectedGender = this.form.get('genderProduct')?.value;
  this.selectedCategory = this.form.get('categoryProduct')?.value;

  const newControls: string[] = [];

  // Determine which controls to add
  switch (this.selectedGender) {
    case 'KIDS':
      newControls.push('height', 'chest', 'waist');
      break;
    case 'WOMEN':
      newControls.push('bust', 'waist', 'hips');
      break;
    case 'MEN':
      if (this.selectedCategory === 'TOP' || this.selectedCategory === 'JACKET') {
        newControls.push('neck', 'chest', 'waist');
      } else if (this.selectedCategory === 'PANTS') {
        newControls.push('inSeam', 'waist');
      }
      break;
  }

  // Remove existing size guide controls
  Object.keys(this.sizeGuideInputs).forEach(key => {
    if (this.form.contains(key)) {
      this.form.removeControl(key);
    }
  });

  // Reset sizeGuideInputs
  this.sizeGuideInputs = {};

  // Add new controls and bind changes
  newControls.forEach(control => {
    this.form.addControl(control, this.fb.control(null));

    this.form.get(control)?.valueChanges.subscribe(val => {
      this.sizeGuideInputs[control] = val;

      switch (this.selectedGender) {
        case 'WOMEN':
          this.checkWomenSize();
          break;
        case 'MEN':
          if (this.selectedCategory === 'TOP' || this.selectedCategory === 'JACKET') {
            this.checkMenTopSize();
          } else if (this.selectedCategory === 'PANTS') {
            this.checkMenButtomSize();
          }
          break;
        case 'KIDS':
          this.checkKidsSize();
          break;
      }
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

        this.http.post<{ fileName: string }>(`${this.apiUrl}/marketplace/upload-image`, formData)
          .subscribe({
            next: (response) => {
              updatedProduct.productImageURL = `${this.apiUrl}/uploads/` + response.fileName;

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
