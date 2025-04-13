import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Ad } from '../../../models/ad';
import { AdService } from '../../../services/ad.service';
import { BrandService } from '../../../services/brand.service';
import { Brand } from '../../../models/brand';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl} from '@angular/forms';
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
  imageInputMethod: 'url' | 'file' = 'url';
  imageUrlControl = new FormControl('', [
  Validators.pattern(/https?:\/\/.+\.(?:png|jpg|jpeg|gif|svg|webp)/i)
  ]);

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
      image: [''],
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
  }
  switchImageInputMethod(method: 'url' | 'file'): void {
    this.imageInputMethod = method;
    this.clearImage();
    if (method === 'url') {
      this.adForm.patchValue({ image: '' });
    }
  }
  
  clearImage(): void {
    this.previewUrl = null;
    this.selectedFile = null;
    this.imageUrlControl.reset();
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
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

  onSubmit(): void {
    if (this.adForm.invalid) return;
  
    this.loading = true;
    const adData = this.adForm.value as Ad;
  
    if (this.imageInputMethod === 'url' && this.imageUrlControl.valid && this.imageUrlControl.value) {
      // Use the URL directly
      adData.image = this.imageUrlControl.value;
      this.saveAd(adData);
    } else if (this.selectedFile) {
      // Upload the file
      this.uploadImageThenSaveAd(adData);
    } else {
      // No image provided
      this.saveAd(adData);
    }
  }

  private uploadImageThenSaveAd(adData: Ad): void {
    if (!this.selectedFile) {
      this.saveAd(adData);
      return;
    }
  
    // Create FormData and append the file
    const formData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name); // Added filename
  
    this.adService.uploadAdImage(formData).subscribe({
      next: (imageUrl: string) => {
        adData.image = imageUrl;
        this.saveAd(adData);
      },
      error: (err: HttpErrorResponse) => {
        this.error = 'Failed to upload image. Please try again.';
        this.loading = false;
        console.error('Image upload error:', err);
      }
    });
  }

  private saveAd(adData: Ad): void {
    const operation = this.isEditMode
      ? this.adService.updateAd(adData)
      : this.adService.addAd(adData);

    operation.subscribe({
      next: () => {
        this.router.navigate(['/ads']);
      },
      error: (err: HttpErrorResponse) => {
        this.error = this.isEditMode
          ? 'Failed to update ad. Please try again.'
          : 'Failed to create ad. Please try again.';
        this.loading = false;
        console.error('Save ad error:', err);
      }
    });
  }

  get titleControl() { return this.adForm.get('title'); }
  get linkControl() { return this.adForm.get('link'); }
  get expDateControl() { return this.adForm.get('expDate'); }
  get brandControl() { return this.adForm.get('brand'); }
}