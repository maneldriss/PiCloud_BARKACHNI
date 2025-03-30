import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Item} from "../../../core/models/item.model";
import {Category} from "../../../core/models/category.enum";
import {OutfitService} from "../../../core/services/outfit.service";
import {ItemService} from "../../../core/services/item.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Outfit} from "../../../core/models/outfit.model";

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
    private snackBar: MatSnackBar
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
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)]
    });
  }

  loadItems(): void {
    this.itemService.getItems().subscribe(items => {
      this.allItems = items;
      this.filterItemsByCategory();
    });
  }

  loadOutfit(id: number): void {
    this.outfitService.getOutfitById(id).subscribe(outfit => {
      if (outfit) {
        this.outfitForm.patchValue({
          name: outfit.name,
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
    this.filteredItems = this.allItems.filter(item => item.category === this.activeCategory);
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
    if (this.outfitForm.invalid) {
      return;
    }

    const outfit: Outfit = {
      ...this.outfitForm.value,
      items: this.selectedItems
    };

    if (this.isEditMode && this.outfitId) {
      outfit.outfitID = this.outfitId;
      this.outfitService.updateOutfit(outfit).subscribe(() => {
        this.snackBar.open('Outfit updated successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/outfits']);
      });
    } else {
      this.outfitService.addOutfit(outfit).subscribe(() => {
        this.snackBar.open('Outfit created successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/outfits']);
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
