import {Component, OnDestroy, OnInit} from '@angular/core';
import {Item} from "../../../../models/Dressing/item.model";
import {Category} from "../../../../models/Dressing/category.enum";
import {Subscription} from "rxjs";
import {ItemService} from "../../../../services/Dressing/item.service";
import {MatDialog} from "@angular/material/dialog";
import {UserService} from "../../../../services/user/user.service";
import {PageEvent} from "@angular/material/paginator";
import {ConfirmDialogComponent} from "../../Design/confirm-dialog-component/confirm-dialog-component.component";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {AuthService} from "../../../../services/auth/auth.service";


@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit,OnDestroy {
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

  pageSize: number = 10;
  currentPage: number = 0;
  loading: boolean = true;

  showOnlyFavorites: boolean = false;

  private userSubscription: Subscription | null = null;

  constructor(
    private itemService: ItemService,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadItems();
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  loadItems() {
    this.loading = true;

    const currentUser = this.authService.getCurrentUser();

    if (currentUser && currentUser.id) {
      const userId = currentUser.id;
      this.itemService.getItemsByUser(userId).subscribe({
        next: (items) => {
          this.items = items;
          this.extractAllFilterOptions();
          this.updateAvailableFilterOptions();
          this.applyFilters();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching items:', error);
          this.loading = false;
        },
      });
    } else {
      // Handle case when user is not available
      console.error('No user is logged in');
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
        this.itemService.deleteItem(id).subscribe({
          next: () => {
            this.items = this.items.filter((item) => item.itemID !== id);
            this.applyFilters();
          },
          error: (error) => {
            console.error('Error deleting item:', error);
          },
        });
      }
    });
  }

  toggleFavorite(item: Item) {
    const newStatus = !item.favorite;
    this.itemService.toggleFavorite(item.itemID || 0, newStatus).subscribe({
      next: (updatedItem) => {
        item.favorite = newStatus;

        const itemIndex = this.items.findIndex(i => i.itemID === item.itemID);
        if (itemIndex !== -1) {
          this.items[itemIndex].favorite = newStatus;
        }

        if (this.showOnlyFavorites) {
          this.applyFilters();
        }
      },
      error: (error) => {
        console.error('Error toggling favorite status:', error);
      }
    });
  }


}
