import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {finalize} from "rxjs";
import {Category} from "../../../../models/Dressing/category.enum";
import {ItemService} from "../../../../services/Dressing/item.service";
import {ImageProcessingService} from "../../../../services/Dressing/image-processing.service";
import {ColorService} from "../../../../services/Dressing/color.service";
import {Item} from "../../../../models/Dressing/item.model";

interface SizeOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css']
})
export class ItemFormComponent implements OnInit,OnDestroy {
  @ViewChild('canvas', {static: false}) canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('imagePreviewElem', {static: false}) imagePreviewElem!: ElementRef<HTMLImageElement>;

  @Input() eyedropperTolerance = 4

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

  eyedropperActive = false;
  sampleRadius = this.eyedropperTolerance;

  displayColorName: string = '';

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private imageService: ImageProcessingService,
    private colorService: ColorService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

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

  toggleEyedropper(event: Event): void {
    event.stopPropagation();
    this.eyedropperActive = !this.eyedropperActive;

    if (this.eyedropperActive) {
      document.body.classList.add('eyedropper-mode');

      let targetContainer: HTMLElement | null = null;
      if (this.imageProcessed && this.processedImageUrl) {
        targetContainer = document.querySelector('.image-preview-processed');
      } else if (this.imagePreview) {
        targetContainer = document.querySelector('.image-preview-container');
      }

      if (targetContainer) {
        targetContainer.classList.add('eyedropper-active');
      }

      document.addEventListener('click', this.handleDocumentClick, { once: true });
    } else {
      this.deactivateEyedropper();
    }
  }

  handleDocumentClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const clickedElement = event.target as HTMLElement;
    let targetImg: HTMLImageElement | null = null;

    if (clickedElement.tagName === 'IMG') {
      targetImg = clickedElement as HTMLImageElement;
    } else {
      const nearestImg = clickedElement.querySelector('img') ||
        clickedElement.closest('.image-preview-container img, .image-preview-processed img');
      if (nearestImg) {
        targetImg = nearestImg as HTMLImageElement;
      }
    }

    if (!targetImg) {
      this.deactivateEyedropper();
      return;
    }

    const rect = targetImg.getBoundingClientRect();

    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const ratioX = clickX / rect.width;
    const ratioY = clickY / rect.height;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', {willReadFrequently: true});

    if (!ctx) {
      this.deactivateEyedropper();
      return;
    }

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      const x = Math.floor(ratioX * img.width);
      const y = Math.floor(ratioY * img.height);

      try {
        const sampleSize = this.sampleRadius * 2 + 1; // width and height of sample area
        const imageData = ctx.getImageData(
          Math.max(0, x - this.sampleRadius),
          Math.max(0, y - this.sampleRadius),
          Math.min(sampleSize, img.width - x + this.sampleRadius),
          Math.min(sampleSize, img.height - y + this.sampleRadius)
        );

        let r = 0, g = 0, b = 0;
        const pixels = imageData.data;
        const numPixels = pixels.length / 4; // each pixel has 4 values (r,g,b,a)

        for (let i = 0; i < pixels.length; i += 4) {
          r += pixels[i];
          g += pixels[i + 1];
          b += pixels[i + 2];
        }

        r = Math.round(r / numPixels);
        g = Math.round(g / numPixels);
        b = Math.round(b / numPixels);

        const hex = '#' +
          ('0' + r.toString(16)).slice(-2) +
          ('0' + g.toString(16)).slice(-2) +
          ('0' + b.toString(16)).slice(-2);

        this.selectColor(hex);
        console.log('Selected color:', hex, 'at position:', x, y, 'with radius:', this.sampleRadius);
      } catch (e) {
        console.error('Error sampling color:', e);
      } finally {
        this.deactivateEyedropper();
      }
    };

    img.onerror = () => {
      console.error('Failed to load image for color sampling');
      this.deactivateEyedropper();
    };

    img.src = targetImg.src;
  }

  deactivateEyedropper(): void {
    this.eyedropperActive = false;
    document.body.classList.remove('eyedropper-mode');

    const containers = document.querySelectorAll('.eyedropper-active');
    containers.forEach(container => container.classList.remove('eyedropper-active'));

    document.removeEventListener('click', this.handleDocumentClick);
  }


  ngOnDestroy(): void {
    this.deactivateEyedropper();
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
        if (item.category) {
          this.itemForm.get('category')?.setValue(item.category);
          this.updateSizeOptions(item.category as Category);
        }

        if (item.color && !item.color.startsWith('#')) {
          this.displayColorName = item.color;
          const storedHex = this.colorService.getHexFromName(item.color);
          if (storedHex) {
            this.selectedColor = storedHex;
          } else {
            this.selectedColor = '#FFFFFF';
          }
        } else {
          this.selectedColor = item.color || '#FFFFFF';
          this.displayColorName = '';
          if (item.color) {
            this.getAndSetColorName(item.color);
          }
        }

        setTimeout(() => {
          this.itemForm.patchValue({
            itemName: item.itemName,
            description: item.description,
            size: item.size,
            brand: item.brand,
            color: item.color || this.selectedColor,
            imageUrl: item.imageUrl
          });
        }, 100);

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

  private getAndSetColorName(hexColor: string): void {
    this.colorService.getColorName(hexColor).subscribe(response => {
      if (response && response.name) {
        this.displayColorName = response.name.value;
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
    this.colorService.getColorName(color).subscribe(response => {
      if (response && response.name) {
        const colorName = response.name.value;
        this.displayColorName = colorName;
        // Store the color name in the form
        this.itemForm.patchValue({color: colorName});
        console.log(`Color ${color} identified as: ${colorName}`);
      } else {
        // If API fails, use the hex code
        this.displayColorName = '';
        this.itemForm.patchValue({color: color});
      }
    });
  }

  getContrastColor(hexColor: string): string {
    return this.colorService.getContrastColor(hexColor);
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

    if (!this.itemForm.get('color')?.value && this.selectedColor) {
      this.colorService.getColorName(this.selectedColor).subscribe(response => {
        if (response && response.name) {
          this.itemForm.patchValue({colorName: response.name.value});
          this.submitFormToServer();
        } else {
          this.itemForm.patchValue({colorName: `Color ${this.selectedColor.replace('#', '')}`});
          this.submitFormToServer();
        }
      });
    } else {
      this.submitFormToServer();
    }
  }

  private submitFormToServer(): void {
    const item: Item = this.itemForm.value;

    if (this.isEditMode && this.itemId) {
      item.itemID = this.itemId;
      this.itemService.updateItem(item).subscribe({
        next: () => {
          this.router.navigate(['/items']);
        },
        error: (err) => {
          console.error('Error updating item:', err);
          this.uploadError = 'Failed to update item. Please try again.';
        }
      });
    } else {
      this.itemService.addItem(item).subscribe({
        next: () => {
          this.router.navigate(['/items']);
        },
        error: (err) => {
          console.error('Error adding item:', err);
          this.uploadError = 'Failed to add item. Please ensure you are logged in.';
        }
      });
    }
  }
}
