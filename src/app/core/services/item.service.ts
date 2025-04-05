import { Injectable } from '@angular/core';
import {Item} from "../models/item.model";
import {Category} from "../models/category.enum";
import {of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private items: Item[] = [
    {
      itemID: 1,
      itemName: 'Blue Jeans',
      description: 'Classic blue denim jeans',
      category: Category.PANTS,
      color: 'Blue',
      size: 'M',
      brand: 'Levi\'s',
      imageUrl: 'assets/images/blue-jeans.jpg',
      dateAdded: new Date()
    },
    {
      itemID: 2,
      itemName: 'White T-Shirt',
      description: 'Basic white cotton t-shirt',
      category: Category.TOPS,
      color: 'White',
      size: 'L',
      brand: 'H&M',
      imageUrl: 'assets/images/white-tshirt.jpg',
      dateAdded: new Date()
    },
    {
      itemID: 3,
      itemName: 'Black Sneakers',
      description: 'Casual black sneakers',
      category: Category.SHOES,
      color: 'Black',
      size: '42',
      brand: 'Nike',
      imageUrl: 'assets/images/black-sneakers.jpg',
      dateAdded: new Date()
    }
  ];

  constructor() {
  }

  getItems(){
    return of(this.items)
  }

  getItemById(id: number) {
    const item = this.items.find(i => i.itemID === id);
    return of(item);
  }

  addItem(item: Item){
    const newItem = {
      ...item,
      itemID: this.items.length + 1,
      dateAdded: new Date()
    };
    this.items.push(newItem);
    return of(newItem);
  }

  updateItem(item: Item){
    const index = this.items.findIndex(i => i.itemID === item.itemID);
    if (index !== -1) {
      this.items[index] = item;
      return of(item);
    }
    return of(item);
  }

  deleteItem(id:number){
    const index = this.items.findIndex(i => i.itemID === id);
    if (index !== -1) {
      this.items.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
}
