import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {OutfitService} from "../../../../services/Dressing/outfit.service";
import {ItemService} from "../../../../services/Dressing/item.service";
import {Item} from "../../../../models/Dressing/item.model";
import {Category} from "../../../../models/Dressing/category.enum";
import {Outfit} from "../../../../models/Dressing/outfit.model";
import {AuthService} from "../../../../services/auth/auth.service";

@Component({
  selector: 'app-outfit-form',
  templateUrl: './outfit-form.component.html',
  styleUrls: ['./outfit-form.component.css']
})
export class OutfitFormComponent implements OnInit {
  outfitForm!: FormGroup;
  isEditMode = false;
  outfitId?: number;

  allItems: Item[] = [];
  filteredItems: Item[] = [];
  selectedItems: Item[] = [];

  categories = Object.values(Category);
  activeCategory: string = Category.TOPS;

  constructor(
    private fb: FormBuilder,
    private outfitService: OutfitService,
    private itemService: ItemService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadItems();

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.outfitId = +params['id'];
        this.loadOutfit(this.outfitId);
      }
    });
  }

  initForm(): void {
    this.outfitForm = this.fb.group({
      outfitName: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', Validators.maxLength(500)]
    });
  }

  getCategoryIcon(category: string): string {
    switch(category) {
      case Category.TOPS:
        return 'loyalty';
      case Category.PANTS:
        return 'format_line_spacing';
      case Category.SHIRTS:
        return 'dry_cleaning';
      case Category.SHOES:
        return 'hiking';
      case Category.DRESSES:
        return 'style';
      case Category.ACCESSORIES:
        return 'watch';
      case Category.OUTERWEAR:
        return 'layers';
      case Category.UNDERWEAR:
        return 'diamond';
      case Category.JEWELRY:
        return 'diamond';
      case Category.BAGS:
        return 'work';
      default:
        return 'checkroom';
    }
  }

  loadItems(): void {
    const currentUser = this.authService.getCurrentUser();

    if (currentUser && currentUser.id) {
      const userId = currentUser.id;

      this.itemService.getItemsByUser(userId).subscribe({
        next: (items) => {
          this.allItems = items;
          this.filterItemsByCategory();
        },
        error: (error) => {
          console.error('Error loading user items:', error);
          this.snackBar.open('Failed to load items. Please try again.', 'Close', { duration: 3000 });
        }
      });
    } else {
      console.error('No user is logged in');
      this.snackBar.open('No user is logged in. Please log in to view items.', 'Close', { duration: 3000 });
    }
  }


  loadOutfit(id: number): void {
    this.outfitService.getOutfitById(id).subscribe(outfit => {
      if (outfit) {
        this.outfitForm.patchValue({
          outfitName: outfit.outfitName,
          description: outfit.description
        });

        if (outfit.items) {
          this.selectedItems = outfit.items;
        }
      }
    });
  }

  selectCategory(category: string): void {
    this.activeCategory = category;
    this.filterItemsByCategory();
  }

  filterItemsByCategory(): void {
    this.filteredItems = this.allItems.filter(item =>
      item.category === this.activeCategory &&
      (!item.outfits || item.outfits.length === 0 || item.outfits.some(outfit => outfit.outfitID === this.outfitId))
    );
  }

  toggleItemSelection(item: Item): void {
    const index = this.selectedItems.findIndex(i => i.itemID === item.itemID);

    if (index === -1) {
      // Item not selected, add it
      this.selectedItems.push(item);
    } else {
      // Item already selected, remove it
      this.selectedItems.splice(index, 1);
    }
  }

  isItemSelected(item: Item): boolean {
    return this.selectedItems.some(i => i.itemID === item.itemID);
  }

  onSubmit(): void {
    // Prevent submission if the form is invalid or no items are selected
    if (this.outfitForm.invalid || this.selectedItems.length === 0) {
      if (this.outfitForm.invalid) {
        this.snackBar.open('Please fill in all required fields correctly', 'Close', { duration: 3000 });
      } else if (this.selectedItems.length === 0) {
        this.snackBar.open('Please select at least one item for the outfit', 'Close', { duration: 3000 });
      }
      return;
    }

    // Prevent automatic submission
    if (!this.outfitForm.get('outfitName')?.value) {
      return;
    }

    const outfit: Outfit = {
      ...this.outfitForm.value,
      items: this.selectedItems
    };

    if (this.isEditMode && this.outfitId) {
      outfit.outfitID = this.outfitId;
      this.outfitService.updateOutfit(outfit).subscribe({
        next: () => {
          this.snackBar.open('Outfit updated successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/outfits']);
        },
        error: (error) => {
          console.error('Error updating outfit:', error);
          this.snackBar.open('Failed to update outfit', 'Close', { duration: 3000 });
        }
      });
    } else {
      this.outfitService.addOutfit(outfit).subscribe({
        next: () => {
          this.snackBar.open('Outfit created successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/outfits']);
        },
        error: (error) => {
          console.error('Error creating outfit:', error);
          this.snackBar.open('Failed to create outfit', 'Close', { duration: 3000 });
        }
      });
    }
  }

  removeItem(item: Item): void {
    const index = this.selectedItems.findIndex(i => i.itemID === item.itemID);
    if (index !== -1) {
      this.selectedItems.splice(index, 1);
    }
  }

  protected readonly Category = Category;
}
