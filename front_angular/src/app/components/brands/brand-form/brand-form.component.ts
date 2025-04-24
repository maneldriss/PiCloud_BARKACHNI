import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Brand } from '../../../models/brand';
import { BrandService } from '../../../services/brand.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-brand-form',
  templateUrl: './brand-form.component.html',
  styleUrls: ['./brand-form.component.css']
})
export class BrandFormComponent implements OnInit {
  brandForm: FormGroup;
  isEditMode = false;
  brandId?: number;
  loadingMessage = 'Saving brand...'; 
  loading = false;
  error = '';
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  maxFileSize = 2 * 1024 * 1024; // 2MB
  uploadProgress: number | null = null;
  logoInputMethod: 'url' | 'upload' = 'url'; // Track input method

  constructor(
    private fb: FormBuilder,
    private brandService: BrandService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.brandForm = this.fb.group({
      name: ['', [Validators.required]],
      logo: ['', [Validators.pattern('(https?://.*.(?:png|jpg|jpeg|gif|svg|webp))')]],
      description: ['', [Validators.maxLength(1000)]],
      rating: [0, [Validators.min(0), Validators.max(5)]],
      address: [''],
      email: ['', [Validators.email]]
    });
  }

  ngOnInit(): void {
    this.brandId = +this.route.snapshot.params['id'];
    this.isEditMode = !!this.brandId;

    if (this.isEditMode) {
      this.loadBrand();
    }

    // Watch for URL changes
    this.brandForm.get('logo')?.valueChanges.subscribe(val => {
      if (this.logoInputMethod === 'url' && val) {
        this.previewUrl = val;
      }
    });
  }

  loadBrand(): void {
    this.loading = true;
    this.brandService.getBrandById(this.brandId!).subscribe({
      next: (brand: Brand) => {
        this.brandForm.patchValue(brand);
        if (brand.logo) {
          this.previewUrl = brand.logo;
          // Determine input method based on logo value
          this.logoInputMethod = brand.logo.startsWith('http') ? 'url' : 'upload';
        }
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.error = 'Failed to load brand details.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.selectedFile = input.files[0];
    this.logoInputMethod = 'upload';
    
    // Validate file size
    if (this.selectedFile.size > this.maxFileSize) {
      this.error = 'File size exceeds 2MB limit.';
      this.selectedFile = null;
      return;
    }

    // Validate file type
    if (!this.selectedFile.type.match(/image\/(jpeg|png|gif|svg\+xml|webp)/)) {
      this.error = 'Only JPG, PNG, GIF, WEBP, or SVG images are allowed.';
      this.selectedFile = null;
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result;
    };
    reader.readAsDataURL(this.selectedFile);
    this.error = '';
  }

  removeLogo(): void {
    this.previewUrl = null;
    this.selectedFile = null;
    this.brandForm.patchValue({ logo: '' });
    const fileInput = document.getElementById('logoUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  switchInputMethod(method: 'url' | 'upload'): void {
    this.logoInputMethod = method;
    if (method === 'url') {
      this.selectedFile = null;
    } else {
      this.brandForm.patchValue({ logo: '' });
    }
  }

  onSubmit(): void {
    if (this.brandForm.invalid) return;

    this.loading = true;
    this.error = '';
    this.uploadProgress = 0;

    if (this.logoInputMethod === 'upload' && this.selectedFile) {
      this.uploadLogoThenSaveBrand();
    } else {
      // Using URL, just save the brand
      this.saveBrand(this.brandForm.value);
    }
  }

  private uploadLogoThenSaveBrand(): void {
    if (!this.selectedFile) return;
  
    const formData = new FormData();
    formData.append('file', this.selectedFile);
  
    this.brandService.uploadLogo(formData).subscribe({
      next: (imageUrl: string) => {
        const brandData = {
          ...this.brandForm.value,
          logo: imageUrl
        };
        this.saveBrand(brandData);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Full error:', err);
        this.error = err.error || 'Failed to upload logo';
        this.loading = false;
      }
    });
  }

  private saveBrand(brandData: Brand): void {
    const operation = this.isEditMode
      ? this.brandService.updateBrand({ ...brandData, id: this.brandId })
      : this.brandService.addBrand(brandData);

    operation.subscribe({
      next: () => {
        this.router.navigate(['/brands'], {
          queryParams: { refresh: new Date().getTime() }
        });
      },
      error: (err: HttpErrorResponse) => {
        this.error = this.isEditMode
          ? 'Failed to update brand. Please try again.'
          : 'Failed to create brand. Please try again.';
        this.loading = false;
        console.error('Save brand error:', err);
      }
    });
  }
  generateDescription() {
    this.loading = true;
    this.error = '';
  
    this.http.post<{description: string}>(
      'http://localhost:8081/pilezelefons/brand/generate-description',
      { keywords: this.nameControl?.value || '' }
    ).subscribe({
      next: (response) => {
        if (response.description) {
          this.brandForm.patchValue({ description: response.description });
        } else {
          this.error = 'Received empty description from server';
        }
      },
      error: (err) => {
        console.error('AI generation failed:', err);
        this.error = err.error?.error || 
                    err.error?.message || 
                    'Failed to generate description. Please try again.';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
  

  get nameControl() { return this.brandForm.get('name'); }
  get emailControl() { return this.brandForm.get('email'); }
  get ratingControl() { return this.brandForm.get('rating'); }
  get logoControl() { return this.brandForm.get('logo'); }
  get descriptionControl() { 
    return this.brandForm.get('description'); 
  }
}