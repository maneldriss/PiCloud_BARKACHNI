import {Component, OnInit} from '@angular/core';
import {Item} from "../../../core/models/item.model";
import {Category} from "../../../core/models/category.enum";
import {ItemService} from "../../../core/services/item.service";
import {PageEvent} from "@angular/material/paginator";
import {ConfirmDialogComponent} from "../../../Design/confirm-dialog-component/confirm-dialog-component.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  items: Item[] = [];
  filteredItems: Item[] = [];
  paginatedItems: Item[] = [];

  allBrands: string[] = [];
  allColors: string[] = [];
  allSizes: string[] = [];
  allCategories = Object.values(Category);

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


  constructor(private itemService: ItemService, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.loading = true;
    this.itemService.getItemsByUser(1).subscribe(items => {
      this.items = items;
      this.extractAllFilterOptions();
      this.updateAvailableFilterOptions();
      this.applyFilters();
      this.loading = false;
    });
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
