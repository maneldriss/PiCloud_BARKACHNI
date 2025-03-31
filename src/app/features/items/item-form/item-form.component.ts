import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Category} from "../../../core/models/category.enum";
import {ItemService} from "../../../core/services/item.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Item} from "../../../core/models/item.model";
import {finalize} from "rxjs";
import {ImageProcessingService} from "../../../core/services/image-processing.service";

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css']
})
export class ItemFormComponent implements OnInit {
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

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private imageService: ImageProcessingService,
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
  }

  initForm(): void {
    this.itemForm = this.fb.group({
      itemName: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', Validators.maxLength(500)],
      category: ['', Validators.required],
      color: ['', Validators.required],
      size: ['', Validators.required],
      brand: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      imageUrl: ['']
    });
  }

  loadItem(id: number): void {
    this.itemService.getItemById(id).subscribe(item => {
      if (item) {
        this.itemForm.patchValue(item);

        if (item.imageUrl) {
          this.imagePreview = item.imageUrl;
          this.processedImageUrl = item.imageUrl;
          this.imageProcessed = true;
        }
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.uploadError = null;

      // Validate file size (limit to 5MB)
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
        this.processImage();
      };
      reader.readAsDataURL(this.selectedFile);
    }
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
            this.processedImageUrl = response.imageUrl;
            this.imageProcessed = true;
            this.itemForm.patchValue({ imageUrl: response.imageUrl });
          },
          error: (error) => {
            console.error('Error processing image:', error);
            this.uploadError = 'Failed to process image. Please try again.';
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
    this.itemForm.patchValue({ imageUrl: '' });
  }

  onSubmit(): void {
    if (this.itemForm.invalid) {
      return;
    }

    const item: Item = this.itemForm.value;

    if (this.isEditMode && this.itemId) {
      item.itemID = this.itemId;
      this.itemService.updateItem(item).subscribe(() => {
        this.router.navigate(['/items']).then(r => console.log(r));
      });
    } else {
      this.itemService.addItem(item).subscribe(() => {
        this.router.navigate(['/items']).then(r => console.log(r));
      });
    }
  }

}
