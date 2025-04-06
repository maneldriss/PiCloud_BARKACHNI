import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Category} from "../../../core/models/category.enum";
import {ItemService} from "../../../core/services/item.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Item} from "../../../core/models/item.model";
import {finalize} from "rxjs";
import {ImageProcessingService} from "../../../core/services/image-processing.service";

interface SizeOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css']
})
export class ItemFormComponent implements OnInit {
  @ViewChild('canvas', {static: false}) canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('imagePreviewElem', {static: false}) imagePreviewElem!: ElementRef<HTMLImageElement>;

  itemForm!: FormGroup;
  categories = Object.values(Category);
  isEditMode = false;
  itemId?: number;

  selectedFile: File | null = null;
  imagePreview: string | null = null;
  processedImageUrl: string | null = null;
  imageProcessed = false;
  processingImage = false;
  uploadError: string | null = null;

  sizeOptions: SizeOption[] = [];
  categorySizes: Record<Category, SizeOption[]> = {
    [Category.SHIRTS]: [
      {value: 'XS', label: 'XS'},
      {value: 'S', label: 'S'},
      {value: 'M', label: 'M'},
      {value: 'L', label: 'L'},
      {value: 'XL', label: 'XL'},
      {value: 'XXL', label: 'XXL'}
    ],
    [Category.TOPS]: [
      {value: 'XS', label: 'XS'},
      {value: 'S', label: 'S'},
      {value: 'M', label: 'M'},
      {value: 'L', label: 'L'},
      {value: 'XL', label: 'XL'},
      {value: 'XXL', label: 'XXL'}
    ],
    [Category.PANTS]: [
      {value: '34', label: '34'},
      {value: '36', label: '36'},
      {value: '38', label: '38'},
      {value: '40', label: '40'},
      {value: '42', label: '42'},
      {value: '44', label: '44'},
      {value: '46', label: '46'}
    ],
    [Category.SHOES]: [
      {value: '36', label: '36 EU / 3.5 UK'},
      {value: '37', label: '37 EU / 4 UK'},
      {value: '38', label: '38 EU / 5 UK'},
      {value: '39', label: '39 EU / 5.5 UK'},
      {value: '40', label: '40 EU / 6.5 UK'},
      {value: '41', label: '41 EU / 7.5 UK'},
      {value: '42', label: '42 EU / 8 UK'},
      {value: '43', label: '43 EU / 9 UK'},
      {value: '44', label: '44 EU / 9.5 UK'},
      {value: '45', label: '45 EU / 10.5 UK'}
    ],
    [Category.DRESSES]: [
      {value: 'XS', label: 'XS (34 EU)'},
      {value: 'S', label: 'S (36 EU)'},
      {value: 'M', label: 'M (38 EU)'},
      {value: 'L', label: 'L (40 EU)'},
      {value: 'XL', label: 'XL (42 EU)'},
      {value: 'XXL', label: 'XXL (44 EU)'}
    ],
    [Category.ACCESSORIES]: [
      {value: 'ONESIZE', label: 'One Size'},
      {value: 'NOSIZE', label: 'No Size'}
    ],
    [Category.OUTERWEAR]: [
      {value: 'XS', label: 'XS'},
      {value: 'S', label: 'S'},
      {value: 'M', label: 'M'},
      {value: 'L', label: 'L'},
      {value: 'XL', label: 'XL'},
      {value: 'XXL', label: 'XXL'}
    ],
    [Category.UNDERWEAR]: [
      {value: 'XS', label: 'XS'},
      {value: 'S', label: 'S'},
      {value: 'M', label: 'M'},
      {value: 'L', label: 'L'},
      {value: 'XL', label: 'XL'}
    ],
    [Category.JEWELRY]: [
      {value: 'ONESIZE', label: 'One Size'},
      {value: 'NOSIZE', label: 'No Size'}
    ],
    [Category.BAGS]: [
      {value: 'ONESIZE', label: 'One Size'},
      {value: 'SMALL', label: 'Small'},
      {value: 'MEDIUM', label: 'Medium'},
      {value: 'LARGE', label: 'Large'},
      {value: 'NOSIZE', label: 'No Size'}
    ]
  };

  selectedColor: string = '#FFFFFF';
  extractedColors: string[] = [];
  predefinedColors: string[] = [
    '#000000',
    '#FFFFFF',
    '#FF0000',
    '#00FF00',
    '#0000FF',
    '#FFFF00',
    '#FF00FF',
    '#00FFFF',
    '#FFA500',
    '#800080',
    '#008000',
    '#800000',
    '#808080',
    '#C0C0C0',
    '#FFD700'
  ];

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private imageService: ImageProcessingService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.initForm();

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.itemId = +params['id'];
        this.loadItem(this.itemId);
      }
    });
    this.itemForm.get('category')?.valueChanges.subscribe(category => {
      this.updateSizeOptions(category);
    });
  }

  initForm(): void {
    this.itemForm = this.fb.group({
      itemName: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', Validators.maxLength(500)],
      category: ['', Validators.required],
      color: ['', Validators.required],
      size: ['', Validators.required],
      brand: ['', Validators.required],
      imageUrl: ['']
    });
  }

  updateSizeOptions(category: Category): void {
    this.sizeOptions = this.categorySizes[category] || [];
    if (this.itemForm.get('size')?.value) {
      this.itemForm.patchValue({size: ''});
    }
  }

  loadItem(id: number): void {
    this.itemService.getItemById(id).subscribe(item => {
      if (item) {
        this.itemForm.patchValue(item);

        if (item.category) {
          this.updateSizeOptions(item.category as Category);
        }

        if (item.color) {
          this.selectedColor = item.color;
        }

        if (item.imageUrl) {
          this.imagePreview = item.imageUrl;
          this.processedImageUrl = item.imageUrl;
          this.imageProcessed = true;

          setTimeout(() => {
            if (this.imagePreviewElem) {
              this.extractColorsFromImage();
            }
          }, 500);
        }
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.uploadError = null;

      if (this.selectedFile.size > 5 * 1024 * 1024) {
        this.uploadError = 'File is too large. Maximum size is 5MB.';
        this.selectedFile = null;
        return;
      }
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(this.selectedFile.type)) {
        this.uploadError = 'Only JPG and PNG files are allowed.';
        this.selectedFile = null;
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;

        setTimeout(() => {
          this.extractColorsFromImage();
        }, 300);

        this.processImage();
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  extractColorsFromImage(): void {
    if (!this.imagePreviewElem || !this.imagePreview) {
      return;
    }

    try {
      const img = this.imagePreviewElem.nativeElement;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', {willReadFrequently: true}); // Add this option

      if (!ctx) {
        return;
      }

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      if (img.complete) {
        try {
          ctx.drawImage(img, 0, 0);
          const extractedColors: string[] = [];
          const numSamples = 10;

          for (let i = 0; i < numSamples; i++) {
            const x = Math.floor(Math.random() * canvas.width);
            const y = Math.floor(Math.random() * canvas.height);
            try {
              const pixel = ctx.getImageData(x, y, 1, 1).data;

              const hex = '#' +
                ('0' + pixel[0].toString(16)).slice(-2) +
                ('0' + pixel[1].toString(16)).slice(-2) +
                ('0' + pixel[2].toString(16)).slice(-2);

              if (!this.colorExists(extractedColors, hex)) {
                extractedColors.push(hex);
              }

              if (extractedColors.length >= 5) {
                break;
              }
            } catch (e) {
              console.warn('Error getting image data:', e);
            }
          }

          this.extractedColors = extractedColors;

          if (this.extractedColors.length > 0 && !this.itemForm.get('color')?.value) {
            this.selectColor(this.extractedColors[0]);
          }
        } catch (e) {
          console.error('Error processing image:', e);
        }
      }
    } catch (error) {
      console.error('Error in color extraction:', error);
      // Fallback to standard colors if extraction fails
      this.extractedColors = this.predefinedColors.slice(0, 5);
    }
  }

  colorExists(colorArray: string[], newColor: string): boolean {
    return colorArray.some(color => {
      const color1 = this.hexToRgb(color);
      const color2 = this.hexToRgb(newColor);

      if (!color1 || !color2) return false;

      const distance = Math.sqrt(
        Math.pow(color1.r - color2.r, 2) +
        Math.pow(color1.g - color2.g, 2) +
        Math.pow(color1.b - color2.b, 2)
      );

      return distance < 30;
    });
  }

  hexToRgb(hex: string): { r: number, g: number, b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  selectColor(color: string): void {
    this.selectedColor = color;
    this.itemForm.patchValue({color: color});
  }

  getContrastColor(hexColor: string): string {
    const rgb = this.hexToRgb(hexColor);
    if (!rgb) return '#000000';

    const luminance = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
    return luminance > 128 ? '#000000' : '#FFFFFF';
  }

  processImage(): void {
    if (this.selectedFile) {
      this.processingImage = true;
      this.imageProcessed = false;

      this.imageService.removeBackground(this.selectedFile)
        .pipe(
          finalize(() => {
            this.processingImage = false;
          })
        )
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.processedImageUrl = response.imageUrl;
              this.imageProcessed = true;
              this.itemForm.patchValue({imageUrl: response.imageUrl});
            } else {
              this.processedImageUrl = this.imagePreview!;
              this.imageProcessed = true;
              this.itemForm.patchValue({imageUrl: this.imagePreview!});
            }
          },
          error: (error) => {
            console.error('Error processing image:', error);
            this.uploadError = 'Failed to process image. Please try again.';
            this.itemForm.patchValue({imageUrl: this.imagePreview!});
          }
        });
    }
  }

  removeImage(event: Event): void {
    event.stopPropagation();
    this.selectedFile = null;
    this.imagePreview = null;
    this.processedImageUrl = null;
    this.imageProcessed = false;
    this.itemForm.patchValue({imageUrl: ''});
  }

  onSubmit(): void {
    if (this.itemForm.invalid) {
      return;
    }

    const item: Item = this.itemForm.value;

    if (this.isEditMode && this.itemId) {
      item.itemID = this.itemId;
      this.itemService.updateItem(item).subscribe({
        next: () => {
          this.router.navigate(['/items']);
        },
        error: (err) => {
          console.error('Error updating item:', err);
        }
      });
    } else {
      this.itemService.addItem(item).subscribe({
        next: () => {
          this.router.navigate(['/items']);
        },
        error: (err) => {
          console.error('Error adding item:', err);
        }
      });
    }
  }
}
