import {Component, OnInit} from '@angular/core';
import {Outfit} from "../../../core/models/outfit.model";
import {Item} from "../../../core/models/item.model";
import {Category} from "../../../core/models/category.enum";
import {ActivatedRoute} from "@angular/router";
import {ItemService} from "../../../core/services/item.service";
import {OutfitService} from "../../../core/services/outfit.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-outfit-detail',
  templateUrl: './outfit-detail.component.html',
  styleUrls: ['./outfit-detail.component.css']
})
export class OutfitDetailComponent implements OnInit {
  outfit: Outfit | null | undefined = null;
  outfitItems: Item[] = [];
  alternativeItems: Item[] = [];
  selectedCategory: string = '';
  loading = true;
  categories = Object.values(Category);

  lockedItems: { [key: number]: boolean } = {};

  constructor(
    private route: ActivatedRoute,
    private outfitService: OutfitService,
    private itemService: ItemService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.loadOutfit(id);
      }
    });
  }

  loadOutfit(id: number): void {
    this.loading = true;
    this.outfitService.getOutfitById(id).subscribe({
      next: (outfit) => {
        this.outfit = outfit || null;
        if (outfit?.items) {
          this.outfitItems = outfit.items;

          this.outfitItems.forEach(item => {
            this.lockedItems[item.itemID as number] = false;
          });

          if (this.outfitItems.length > 0) {
            this.selectCategory(this.outfitItems[0].category);
          }
        }
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load outfit', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.loadAlternativeItems(category);
  }

  loadAlternativeItems(category: string): void {
    this.itemService.getItems().subscribe(items => {
      const categoryItems = items.filter(item => item.category === category);
      this.alternativeItems = categoryItems.filter(item =>
        !this.outfitItems.some(outfitItem =>
          outfitItem.itemID === item.itemID &&
          !this.lockedItems[item.itemID as number]
        )
      );
    });
  }

  toggleLockItem(item: Item): void {
    if (item.itemID !== undefined) {
      this.lockedItems[item.itemID] = !this.lockedItems[item.itemID];

      if (item.category === this.selectedCategory) {
        this.loadAlternativeItems(this.selectedCategory);
      }
    }
  }

  isItemLocked(itemId: number): boolean {
    return this.lockedItems[itemId] || false;
  }

  replaceItem(oldItem: Item, newItem: Item): void {
    const index = this.outfitItems.findIndex(item => item.itemID === oldItem.itemID);

    if (index !== -1) {
      this.outfitItems[index] = newItem;

      if (this.outfit) {
        this.outfit.items = [...this.outfitItems];

        this.outfitService.updateOutfit(this.outfit).subscribe({
          next: () => {
            this.snackBar.open('Outfit updated successfully', 'Close', { duration: 3000 });
          },
          error: () => {
            this.snackBar.open('Failed to update outfit', 'Close', { duration: 3000 });
          }
        });
      }

      this.loadAlternativeItems(this.selectedCategory);
    }
  }

  getCategoryItems(): Item[] {
    return this.outfitItems.filter(item => item.category === this.selectedCategory);
  }

  saveOutfit(): void {
    if (this.outfit) {
      this.outfit.items = [...this.outfitItems];

      this.outfitService.updateOutfit(this.outfit).subscribe({
        next: () => {
          this.snackBar.open('Outfit saved successfully', 'Close', { duration: 3000 });
        },
        error: () => {
          this.snackBar.open('Failed to save outfit', 'Close', { duration: 3000 });
        }
      });
    }
  }

}
