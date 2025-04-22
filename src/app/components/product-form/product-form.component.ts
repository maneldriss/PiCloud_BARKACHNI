import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
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
  //newly added
  aiProcessing = false;
  predictedCategory: string | null = null;
showCategoryOverride = false;

  //sizing and fit
  productGenders: string[] = ['MEN', 'WOMEN', 'KIDS', 'UNISEX'];
  allSizes: string[] = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];
  allCategories: string[] = ['PANTS','TOP','JACKET','DRESS','SKIRT','BAG','ACCESSORIES'];
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
      genderProduct: ['', Validators.required],
      productSize: ['', Validators.required],
      productSeller: [''],
      dateProductAdded: [new Date().toISOString().substring(0, 16)], // Default to now
      productImageURL: [''],
      productDescription: [''],
      productPrice: [0, [Validators.required, Validators.min(0.01), Validators.max(500)]],
      productState: [Validators.required],
      height: [''],
      chest: [''],
      waist: [''],
      bust: [''],
      hips: [''],
      neck: [''],
      inSeam: ['']
    });
    
  }
//sizing related
onGenderChange() {
  this.selectedGender = this.productForm.get('genderProduct')?.value;

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
  this.selectedCategory = this.productForm.get('categoryProduct')?.value;
  this.updateSizeGuideInputs(); 
}

ensureControlExists(name: string) {
  if (!this.productForm.contains(name)) {
    this.productForm.addControl(name, new FormControl(null));
  }
}
updateSizeGuideInputs() {
  // Ensure form is initialized
  if (!this.productForm) return;

  // Get current values
  this.selectedGender = this.productForm.get('genderProduct')?.value;
  this.selectedCategory = this.productForm.get('categoryProduct')?.value;
  
  console.log('Updating size guide:', {
    gender: this.selectedGender,
    category: this.selectedCategory
  });

  // Determine which controls to show based on gender and category
  const newControls: string[] = [];

  if (this.selectedGender === 'KIDS') {
    newControls.push('height', 'chest', 'waist');
  } else if (this.selectedGender === 'WOMEN') {
    newControls.push('bust', 'waist', 'hips');
  } else if (this.selectedGender === 'MEN') {
    if (this.selectedCategory === 'TOP' || this.selectedCategory === 'JACKET') {
      newControls.push('neck', 'chest', 'waist');
    } else if (this.selectedCategory === 'PANTS') {
      newControls.push('inSeam', 'waist');
    }
  }

  // Remove only size-related controls that aren't needed anymore
  const sizeControls = ['height', 'chest', 'waist', 'bust', 'hips', 'neck', 'inSeam'];
  sizeControls.forEach(control => {
    if (this.productForm.contains(control) && !newControls.includes(control)) {
      this.productForm.removeControl(control);
      delete this.sizeGuideInputs[control];
    }
  });

  // Add new controls if they don't exist
  newControls.forEach(control => {
    if (!this.productForm.contains(control)) {
      this.productForm.addControl(control, this.fb.control(null));
    }

    // Update the sizeGuideInputs object when values change
    this.productForm.get(control)?.valueChanges.subscribe(val => {
      this.sizeGuideInputs[control] = val;
      this.calculateSize();
    });
  });
}

// New helper method to handle size calculation
calculateSize() {
  if (!this.selectedGender) return;

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
}
//upload file related:updated
onFileSelected(event: any): void {
  this.selectedFile = event.target.files[0];
  this.aiProcessing = true;
  
  const formData = new FormData();
  if (this.selectedFile) {
    formData.append('file', this.selectedFile);
  }
  
  this.http.post<{predictions: Array<{label: string, score: number}>}>(
    'http://localhost:5000/predict-category',
    formData
  ).subscribe({
    next: (response) => {
      this.predictedCategory = this.mapToCategory(response.predictions[0].label);
      this.productForm.patchValue({
        categoryProduct: this.predictedCategory
      });
    },
    error: (err) => console.error('AI error:', err),
    complete: () => this.aiProcessing = false
  });
}

private mapToCategory(aiLabel: string): string {
  aiLabel = aiLabel.toLowerCase();
  if (aiLabel.includes('jean') || aiLabel.includes('denim') || aiLabel.includes('pants')) {
    return 'PANTS';
  }
  if (aiLabel.includes('dress') || aiLabel.includes('gown')){ return 'DRESS';}
  if (aiLabel.includes('shirt') || aiLabel.includes('t-shirt') || aiLabel.includes('top')|| aiLabel.includes('poncho')) return 'TOP';
  if (aiLabel.includes('jacket') || aiLabel.includes('coat')|| aiLabel.includes('cardigan')|| aiLabel.includes('suit')) return 'JACKET';
  if (aiLabel.includes('skirt')) return 'SKIRT';
  if (aiLabel.includes('bag')) return 'BAG';
  if (aiLabel.includes('shoe') || aiLabel.includes('sneaker')) return 'SHOES';
  return 'ACCESSORIES'; 
}

//newly added
toggleCategoryOverride(): void {
  this.showCategoryOverride = !this.showCategoryOverride;
  if (this.showCategoryOverride) {
    this.productForm.get('categoryProduct')?.enable();
  }
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
    setTimeout(() => {
      this.updateSizeGuideInputs();
    });
  
    // Watch for form changes
    this.productForm.valueChanges.subscribe(() => {
      this.updateSizeGuideInputs();
    });
  }

    onSubmit(): void {
      if (this.productForm.invalid) return;
      
      this.loading = true;
      const formValues = this.productForm.value;
    
      const formData = new FormData();
      // Append all form values
      formData.append('nameProduct', formValues.nameProduct);
      formData.append('categoryProduct', formValues.categoryProduct);
      formData.append('genderProduct', formValues.genderProduct);
      formData.append('productSize', formValues.productSize);
      formData.append('productSeller', formValues.productSeller?.idUser || ''); 
      formData.append('dateProductAdded', new Date().toISOString()); 
      formData.append('productDescription', formValues.productDescription);
      formData.append('productPrice', formValues.productPrice.toString());
      formData.append('productState', formValues.productState || 'AVAILABLE');
      
      if (this.selectedFile) {
        formData.append('file', this.selectedFile);
      }
    
      this.productService.uploadWithAutoTag(
        formData
      ).subscribe({
        next: () => {
          this.router.navigate(['/products']);
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.error = err.message || 'Failed to create product';
          console.error('Upload error:', err);
        }
      });
    }
}
