import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Ad } from '../../../models/ad';
import { AdService } from '../../../services/ad.service';
import { BrandService } from '../../../services/brand.service';
import { Brand } from '../../../models/brand';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-ad-form',
  templateUrl: './ad-form.component.html',
  styleUrls: ['./ad-form.component.css']
})
export class AdFormComponent implements OnInit {
  
  adForm: FormGroup;
  isEditMode = false;
  adId?: number;
  loading = false;
  error = '';
  brands: Brand[] = [];
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  maxFileSize = 2 * 1024 * 1024; // 2MB
  uploadProgress: number | null = null;
  imageInputMethod: 'url' | 'upload' = 'url'; // Track input method

  constructor(
    private fb: FormBuilder,
    private adService: AdService,
    private brandService: BrandService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.adForm = this.fb.group({
      title: ['', [Validators.required]],
      description: [''],
      image: ['', [Validators.pattern('(https?://.*.(?:png|jpg|jpeg|gif|svg|webp))')]],
      link: ['', [Validators.required]],
      expDate: ['', [Validators.required]],
      brand: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadBrands();
    
    this.adId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.adId;

    if (this.isEditMode) {
      this.loadAd();
    }

    // Set default expiration date to 30 days from now
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 30);
    this.adForm.patchValue({
      expDate: defaultDate.toISOString().substring(0, 10)
    });

    // Watch for URL changes
    this.adForm.get('image')?.valueChanges.subscribe(val => {
      if (this.imageInputMethod === 'url' && val) {
        this.previewUrl = val;
      }
    });
  }

  loadBrands(): void {
    this.brandService.getAllBrands().subscribe({
      next: (brands) => {
        this.brands = brands;
      },
      error: (err) => {
        console.error('Failed to load brands', err);
      }
    });
  }

  loadAd(): void {
    this.loading = true;
    this.adService.getAdById(this.adId!).subscribe({
      next: (ad) => {
        this.adForm.patchValue({
          title: ad.title,
          description: ad.description,
          image: ad.image,
          link: ad.link,
          expDate: new Date(ad.expDate).toISOString().substring(0, 10),
          brand: ad.brand?.id
        });
        if (ad.image) {
          this.previewUrl = ad.image;
          // Determine input method based on image value
          this.imageInputMethod = ad.image.startsWith('http') ? 'url' : 'upload';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load ad details.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.selectedFile = input.files[0];
    this.imageInputMethod = 'upload';
    
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

  removeImage(): void {
    this.previewUrl = null;
    this.selectedFile = null;
    this.adForm.patchValue({ image: '' });
    const fileInput = document.getElementById('adImageUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  switchInputMethod(method: 'url' | 'upload'): void {
    this.imageInputMethod = method;
    if (method === 'url') {
      this.selectedFile = null;
    } else {
      this.adForm.patchValue({ image: '' });
    }
  }

  onSubmit(): void {
    if (this.adForm.invalid) return;
  
    this.loading = true;
    this.error = '';
    this.uploadProgress = 0;

    if (this.imageInputMethod === 'upload' && this.selectedFile) {
      this.uploadImageThenSaveAd();
    } else {
      // Using URL, just save the ad
      this.saveAd(this.adForm.value);
    }
  }

  private uploadImageThenSaveAd(): void {
    if (!this.selectedFile) return;
  
    const formData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);
  
    this.adService.uploadAdImage(formData).subscribe({
      next: (imageUrl: string) => {
        const adData = {
          ...this.adForm.value,
          image: imageUrl
        };
        this.saveAd(adData);
      },
      error: (err: HttpErrorResponse) => {
        this.error = 'Failed to upload image. Please try again.';
        this.loading = false;
        console.error('Image upload error:', err);
      }
    });
  }

  private saveAd(adData: any): void {
    // Format the data correctly for backend
    const formattedAd = {
      ...adData,
      id: this.isEditMode ? this.adId : undefined, // Include ID for edits
      // Convert brand ID to brand object
      brand: { id: adData.brand },
      // Ensure date is in correct format
      expDate: new Date(adData.expDate).toISOString(),
      // Maintain existing click count for edits, initialize for new ads
      nbClicks: this.isEditMode ? adData.nbClicks || 0 : 0
    };
  
    const operation = this.isEditMode
      ? this.adService.updateAd(formattedAd)
      : this.adService.addAd(formattedAd);
  
    operation.subscribe({
      next: () => {
        this.router.navigate(['/brands'], {
          queryParams: { refresh: new Date().getTime() }
        });
      },
      error: (err: HttpErrorResponse) => {
        // Parse backend error if available
        const backendError = err.error?.message || 
                           (err.error?.errors ? this.formatErrors(err.error.errors) : 
                           err.message);
        
        this.error = backendError || 
                    (this.isEditMode 
                      ? 'Failed to update ad. Please try again.' 
                      : 'Failed to create ad. Please try again.');
        this.loading = false;
        console.error('Save ad error:', err);
      }
    });
  }
  
  private formatErrors(errors: any): string {
    return Object.keys(errors)
      .map(key => `${key}: ${errors[key]}`)
      .join(', ');
  }

  get titleControl() { return this.adForm.get('title'); }
  get linkControl() { return this.adForm.get('link'); }
  get expDateControl() { return this.adForm.get('expDate'); }
  get brandControl() { return this.adForm.get('brand'); }
  get imageControl() { return this.adForm.get('image'); }
}