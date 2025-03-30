import {Component, OnInit} from '@angular/core';
import {Item} from "../../../core/models/item.model";
import {ActivatedRoute, Router} from "@angular/router";
import {ItemService} from "../../../core/services/item.service";

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css']
})
export class ItemDetailComponent implements OnInit{
  item?: Item;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private itemService: ItemService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const itemId = Number(params.get('id'));
      if (itemId) {
        this.loadItem(itemId);
      }
    });
  }

  loadItem(id: number): void {
    this.loading = true;
    this.itemService.getItemById(id).subscribe({
      next: (item) => {
        this.item = item;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/items']);
      }
    });
  }

  deleteItem(): void {
    if (!this.item || !this.item.itemID) return;

    if (confirm('Are you sure you want to delete this item?')) {
      this.itemService.deleteItem(this.item.itemID).subscribe(() => {
        this.router.navigate(['/items']);
      });
    }
  }
}
