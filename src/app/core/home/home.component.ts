import {Component, OnInit} from '@angular/core';
import { Item } from "../models/item.model";
import { Outfit } from "../models/outfit.model";
import { ItemService } from "../services/item.service";
import { OutfitService } from "../services/outfit.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  recentItems: Item[] = [];
  recentOutfits: Outfit[] = [];
  totalItems: number = 0;
  totalOutfits: number = 0;

  constructor(
    private itemService: ItemService,
    private outfitService: OutfitService
  ) { }

  ngOnInit(): void {
    this.loadRecentItems();
    this.loadRecentOutfits();
  }

  loadRecentItems(): void {
    this.itemService.getItemsByUser(1).subscribe(items => {
      this.recentItems = items
        .sort((a, b) => new Date(b.dateAdded || 0).getTime() - new Date(a.dateAdded || 0).getTime())
        .slice(0, 4);
      this.totalItems = items.length
    });
  }

  loadRecentOutfits(): void {
    this.outfitService.getOutfitsByUser(1).subscribe(outfits => {
      this.recentOutfits = outfits.slice(0, 4);
      this.totalOutfits = outfits.length;
    });
  }
}
