import {Component, OnInit} from '@angular/core';
import {Item} from "../../../core/models/item.model";
import {Category} from "../../../core/models/category.enum";
import {ItemService} from "../../../core/services/item.service";

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit{
    items: Item[] = [];
    filteredItems: Item[] = [];
    categories = Object.values(Category);
    selectedCategory: Category | 'ALL' = 'ALL';

    constructor(private itemService: ItemService) {
    }

    ngOnInit() {
      this.loadItems();
    }

    loadItems(){
      this.itemService.getItems().subscribe(items => {
        this.items = items;
        this.applyFilter();
      });
    }

    applyFilter(){
      if (this.selectedCategory === 'ALL') {
        this.filteredItems = [...this.items];
      }
      else {
        this.filteredItems = this.items.filter(item => item.category === this.selectedCategory);
      }
    }

    onCategoryChange(category: Category | 'ALL'){
      this.selectedCategory = category;
      this.applyFilter();
    }

    deleteItem(id: number){
      if (confirm('Are you sure you want to delete this item?')) {
        this.itemService.deleteItem(id).subscribe(() => {
          this.loadItems();
        });
      }
    }
}
