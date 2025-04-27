import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Item} from "../../../../models/Dressing/item.model";
import {Category} from "../../../../models/Dressing/category.enum";
import {ItemService} from "../../../../services/Dressing/item.service";
import {OutfitService} from "../../../../services/Dressing/outfit.service";
import {AIOutfitRecommendationService} from "../../../../services/Dressing/ai-outfit-recommendation.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {finalize} from "rxjs";
import {Outfit} from "../../../../models/Dressing/outfit.model";
import {AuthService} from "../../../../services/auth/auth.service";


@Component({
  selector: 'app-ai-outfit-builder',
  templateUrl: './ai-outfit-builder.component.html',
  styleUrls: ['./ai-outfit-builder.component.css']
})
export class AIOutfitBuilderComponent implements OnInit {
  outfitForm: FormGroup;
  allItems: Item[] = [];
  selectedItems: Item[] = [];
  suggestedItems: Item[] = [];
  categories = Object.values(Category);
  userItems: Item[] = [];

  seasons = ['Spring', 'Summer', 'Fall', 'Winter'];
  occasions = ['Casual', 'Formal', 'Business', 'Sport', 'Party', 'Rainy', 'Snowy', 'Sunny'];

  loading = false;
  recommendationsLoading = false;

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private outfitService: OutfitService,
    private aiService: AIOutfitRecommendationService,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.outfitForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      season: [''],
      occasion: ['']
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.itemService.getItems().pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: (items) => {
        this.allItems = items;
      },
      error: (error) => {
        console.error('Error loading items:', error);
        this.snackBar.open('Failed to load items', 'Close', { duration: 3000 });
      }
    });
  }

  addItemToOutfit(item: Item): void {
    if (!this.selectedItems.some(i => i.itemID === item.itemID)) {
      this.selectedItems.push(item);
      this.getSuggestedItems();
    }
  }

  removeItemFromOutfit(item: Item): void {
    this.selectedItems = this.selectedItems.filter(i => i.itemID !== item.itemID);
    if (this.selectedItems.length > 0) {
      this.getSuggestedItems();
    } else {
      this.suggestedItems = [];
    }
  }

  getSuggestedItems(): void {
    if (this.selectedItems.length === 0) {
      this.suggestedItems = [];
      return;
    }

    this.recommendationsLoading = true;
    this.aiService.findComplementaryItems(this.selectedItems, this.allItems)
      .pipe(finalize(() => this.recommendationsLoading = false))
      .subscribe({
        next: (items) => {
          this.suggestedItems = items;
        },
        error: (error) => {
          console.error('Error getting suggestions:', error);
          this.snackBar.open('Failed to get AI suggestions', 'Close', { duration: 3000 });
        }
      });
  }

  saveOutfit(): void {
    if (this.outfitForm.invalid) {
      this.snackBar.open('Please fill in all required fields', 'Close', { duration: 3000 });
      return;
    }

    if (this.selectedItems.length === 0) {
      this.snackBar.open('Please add at least one item to the outfit', 'Close', { duration: 3000 });
      return;
    }

    const outfit: Outfit = {
      ...this.outfitForm.value,
      items: this.selectedItems
    };

    this.loading = true;
    this.outfitService.addOutfit(outfit)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this.snackBar.open('Outfit created successfully', 'Close', { duration: 3000 });
          this.resetForm();
        },
        error: (error) => {
          console.error('Error creating outfit:', error);
          this.snackBar.open('Failed to create outfit', 'Close', { duration: 3000 });
        }
      });
  }

  resetForm(): void {
    this.outfitForm.reset();
    this.selectedItems = [];
    this.suggestedItems = [];
  }

  getItemsByCategory(category: string): Item[] {
    return this.userItems.filter(item =>
      item.category === category &&
      !this.selectedItems.some(i => i.itemID === item.itemID)
    );
  }


  loadUserItems(): void {
    const currentUser = this.authService.getCurrentUser();

    if (currentUser && currentUser.id) {
      const userId = currentUser.id;

      this.itemService.getItemsByUser(userId).subscribe({
        next: (items) => {
          this.userItems = items;
          // Optionally trigger filters or other logic here
        },
        error: (error) => {
          console.error('Error loading user items:', error);
        }
      });
    } else {
      console.error('No user is logged in');
    }
  }

}
