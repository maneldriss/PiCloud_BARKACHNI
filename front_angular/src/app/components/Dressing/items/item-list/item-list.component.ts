import {Component, OnDestroy, OnInit} from '@angular/core';
import {Item} from "../../../../models/Dressing/item.model";
import {Category} from "../../../../models/Dressing/category.enum";
import {Subscription} from "rxjs";
import {ItemService} from "../../../../services/Dressing/item.service";
import {MatDialog} from "@angular/material/dialog";
import {UserService} from "../../../../services/user/user.service";
import {PageEvent} from "@angular/material/paginator";
import {ConfirmDialogComponent} from "../../Design/confirm-dialog-component/confirm-dialog-component.component";
import {AuthService} from "../../../../services/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit, OnDestroy {
  items: Item[] = [];
  filteredItems: Item[] = [];
  paginatedItems: Item[] = [];

  allBrands: string[] = [];
  allColors: string[] = [];
  allSizes: string[] = [];
  allCategories: Category[] = Object.values(Category) as Category[];

  availableBrands: string[] = [];
  availableColors: string[] = [];
  availableSizes: string[] = [];
  availableCategories: Category[] = [];

  selectedCategory: Category | 'ALL' = 'ALL';
  selectedBrand: string = 'ALL';
  selectedColor: string = 'ALL';
  selectedSize: string = 'ALL';
  showAdvancedFilters: boolean = false;
  searchTerm: string = '';
  showOnlyInOutfits: boolean = false;
  showOnlyNotInOutfits: boolean = false;

  pageSize: number = 10;
  currentPage: number = 0;
  loading: boolean = true;

  showOnlyFavorites: boolean = false;

  constructor(
    private itemService: ItemService,
    private dialog: MatDialog,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadItems();
  }

  ngOnDestroy() {
    // No subscriptions to clean up
  }

  loadItems() {
    this.loading = true;

    const currentUser = this.authService.getCurrentUser();

    if (currentUser?.id) {
      this.itemService.getItemsByUser(currentUser.id).subscribe({
        next: (items) => {
          this.items = items;
          this.extractAllFilterOptions();
          this.updateAvailableFilterOptions();
          this.applyFilters();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching items:', error);
          this.snackBar.open(`Failed to load items: ${error.message || 'Unknown error'}`, 'Close', { duration: 3000 });
          this.loading = false;
        },
      });
    } else {
      console.error('No user is logged in');
      this.snackBar.open('Please log in to view your items', 'Close', { duration: 3000 });
      this.loading = false;
    }
  }

  extractAllFilterOptions() {
    this.allBrands = [...new Set(this.items.map(item => item.brand).filter(brand => brand))];
    this.allColors = [...new Set(this.items.map(item => item.color).filter(color => color))];
    this.allSizes = [...new Set(this.items.map(item => item.size).filter(size => size))];
  }

  updateAvailableFilterOptions() {
    let filteredSubset = [...this.items];

    if (this.selectedCategory !== 'ALL') {
      filteredSubset = filteredSubset.filter(item => item.category === this.selectedCategory);
    }
    if (this.selectedBrand !== 'ALL') {
      filteredSubset = filteredSubset.filter(item => item.brand === this.selectedBrand);
    }
    if (this.selectedColor !== 'ALL') {
      filteredSubset = filteredSubset.filter(item => item.color === this.selectedColor);
    }
    if (this.selectedSize !== 'ALL') {
      filteredSubset = filteredSubset.filter(item => item.size === this.selectedSize);
    }
    this.availableCategories = [...new Set(filteredSubset.map(item => item.category))];
    this.availableBrands = [...new Set(filteredSubset.map(item => item.brand).filter(brand => brand))];
    this.availableColors = [...new Set(filteredSubset.map(item => item.color).filter(color => color))];
    this.availableSizes = [...new Set(filteredSubset.map(item => item.size).filter(size => size))];
  }

  applyFilters() {
    let result = [...this.items];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(item =>
        item.itemName.toLowerCase().includes(term) ||
        (item.description && item.description.toLowerCase().includes(term))
      );
    }

    if (this.selectedCategory !== 'ALL') {
      result = result.filter(item => item.category === this.selectedCategory);
    }

    if (this.selectedBrand !== 'ALL') {
      result = result.filter(item => item.brand === this.selectedBrand);
    }

    if (this.selectedColor !== 'ALL') {
      result = result.filter(item => item.color === this.selectedColor);
    }

    if (this.selectedSize !== 'ALL') {
      result = result.filter(item => item.size === this.selectedSize);
    }

    if (this.showOnlyFavorites) {
      result = result.filter(item => item.favorite);
    }

    if (this.showOnlyInOutfits) {
      result = result.filter(item => item.outfits && item.outfits.length > 0);
    }

    if (this.showOnlyNotInOutfits) {
      result = result.filter(item => !item.outfits || item.outfits.length === 0);
    }

    this.filteredItems = result;
    this.updatePaginatedItems();
    this.updateAvailableFilterOptions();
  }

  updatePaginatedItems() {
    const startIndex = this.currentPage * this.pageSize;
    this.paginatedItems = this.filteredItems.slice(startIndex, startIndex + this.pageSize);
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedItems();
  }

  toggleAdvancedFilters() {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  onFilterChange(filterType: string, value: any) {
    switch (filterType) {
      case 'category':
        this.selectedCategory = value;
        break;
      case 'brand':
        this.selectedBrand = value;
        break;
      case 'color':
        this.selectedColor = value;
        break;
      case 'size':
        this.selectedSize = value;
        break;
    }

    this.applyFilters();
    this.currentPage = 0;
  }

  resetFilters() {
    this.selectedCategory = 'ALL';
    this.selectedBrand = 'ALL';
    this.selectedColor = 'ALL';
    this.selectedSize = 'ALL';
    this.searchTerm = '';
    this.showOnlyFavorites = false;
    this.showOnlyInOutfits = false;
    this.showOnlyNotInOutfits = false;
    this.applyFilters();
    this.currentPage = 0;
  }

  clearSearch() {
    this.searchTerm = '';
    this.applyFilters();
  }

  deleteItem(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: 'Are you sure you want to delete this item?' }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loading = true;
        this.itemService.deleteItem(id).subscribe({
          next: () => {
            this.loadItems();
            this.snackBar.open('Item deleted successfully', 'Close', { duration: 3000 });
          },
          error: (error) => {
            console.error('Error deleting item:', error);
            this.loading = false;
            this.snackBar.open(error.message || 'Failed to delete item', 'Close', { duration: 5000 });
          }
        });
      }
    });
  }

  toggleFavorite(item: Item) {
    if (!item.itemID) {
      this.snackBar.open('Cannot toggle favorite: Item ID is missing', 'Close', { duration: 3000 });
      return;
    }

    const newStatus = !item.favorite;
    this.itemService.toggleFavorite(item.itemID, newStatus).subscribe({
      next: (updatedItem) => {
        item.favorite = newStatus;

        const itemIndex = this.items.findIndex(i => i.itemID === item.itemID);
        if (itemIndex !== -1) {
          this.items[itemIndex].favorite = newStatus;
        }

        if (this.showOnlyFavorites) {
          this.applyFilters();
        }

        this.snackBar.open(
          `Item ${newStatus ? 'added to' : 'removed from'} favorites`,
          'Close',
          { duration: 2000 }
        );
      },
      error: (error) => {
        console.error('Error toggling favorite status:', error);
        this.snackBar.open(`Failed to update favorite status: ${error.message || 'Unknown error'}`, 'Close', { duration: 3000 });
      }
    });
  }

  toggleOutfitFilter(filterType: 'in' | 'not') {
    if (filterType === 'in') {
      this.showOnlyInOutfits = !this.showOnlyInOutfits;
      if (this.showOnlyInOutfits) {
        this.showOnlyNotInOutfits = false;
      }
    } else {
      this.showOnlyNotInOutfits = !this.showOnlyNotInOutfits;
      if (this.showOnlyNotInOutfits) {
        this.showOnlyInOutfits = false;
      }
    }
    this.applyFilters();
    this.currentPage = 0;
  }
}
