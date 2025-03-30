import {Component, OnInit} from '@angular/core';
import {Outfit} from "../../../core/models/outfit.model";
import {OutfitService} from "../../../core/services/outfit.service";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-outfit-list',
  templateUrl: './outfit-list.component.html',
  styleUrls: ['./outfit-list.component.css']
})
export class OutfitListComponent implements OnInit {
  outfits: Outfit[] = [];
  loading = true;

  constructor(
    private outfitService: OutfitService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadOutfits();
  }

  loadOutfits(): void {
    this.loading = true;
    this.outfitService.getOutfits().subscribe({
      next: (outfits) => {
        this.outfits = outfits;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load outfits', 'Close', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }

  deleteOutfit(id: number): void {
    if (confirm('Are you sure you want to delete this outfit?')) {
      this.outfitService.deleteOutfit(id).subscribe({
        next: () => {
          this.loadOutfits();
          this.snackBar.open('Outfit deleted successfully', 'Close', {
            duration: 3000
          });
        },
        error: () => {
          this.snackBar.open('Failed to delete outfit', 'Close', {
            duration: 3000
          });
        }
      });
    }
  }
}
