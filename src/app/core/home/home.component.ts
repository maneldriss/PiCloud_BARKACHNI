import { Component } from '@angular/core';
import {Item} from "../models/item.model";
import {Outfit} from "../models/outfit.model";
import {ItemService} from "../services/item.service";
import {OutfitService} from "../services/outfit.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  recentItems: Item[] = [];
  recentOutfits: Outfit[] = [];

  constructor(
    private itemService: ItemService,
    private outfitService: OutfitService
  ) { }

  ngOnInit(): void {
    this.loadRecentItems();
    this.loadRecentOutfits();
  }

  loadRecentItems(): void {
    this.itemService.getItems().subscribe(items => {
      this.recentItems = items
        .sort((a, b) => new Date(b.dateAdded || 0).getTime() - new Date(a.dateAdded || 0).getTime())
        .slice(0, 4);
    });
  }

  loadRecentOutfits(): void {
    this.outfitService.getOutfits().subscribe(outfits => {
      this.recentOutfits = outfits.slice(0, 4);
    });
  }
}
