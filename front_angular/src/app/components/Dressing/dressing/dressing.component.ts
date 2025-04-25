import {Component, OnDestroy, OnInit} from "@angular/core";
import {Item} from "../../../models/Dressing/item.model";
import {Outfit} from "../../../models/Dressing/outfit.model";
import {Subscription} from "rxjs";
import {User} from "../../../models/user";
import {ItemService} from "../../../services/Dressing/item.service";
import {OutfitService} from "../../../services/Dressing/outfit.service";
import {UserService} from "../../../services/user/user.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../../../services/auth/auth.service";


@Component({
  selector: 'app-dressing',
  templateUrl: './dressing.component.html',
  styleUrls: ['./dressing.component.css']
})
export class DressingComponent implements OnInit, OnDestroy {
  recentItems: Item[] = [];
  recentOutfits: Outfit[] = [];
  totalItems: number = 0;
  totalOutfits: number = 0;
  private userSubscription: Subscription | null = null;
  currentUser: User | null = null;

  constructor(
    private itemService: ItemService,
    private outfitService: OutfitService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();

    if (currentUser && currentUser.id) {
      this.currentUser = currentUser;
      this.loadRecentItems();
      this.loadRecentOutfits();
    } else {
      console.error('No user is logged in');
      this.snackBar.open('Failed to load user data.', 'Close', { duration: 3000 });
    }
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  loadRecentItems(): void {
    const currentUser = this.authService.getCurrentUser();

    if (currentUser && currentUser.id) {
      this.itemService.getItemsByUser(currentUser.id).subscribe({
        next: (items) => {
          this.recentItems = items
            .sort((a, b) => new Date(b.dateAdded || 0).getTime() - new Date(a.dateAdded || 0).getTime())
            .slice(0, 4);
          this.totalItems = items.length;
        },
        error: () => {
          this.snackBar.open('Failed to load items for the current user.', 'Close', { duration: 3000 });
        }
      });
    } else {
      console.error('No user is logged in');
      this.snackBar.open('Failed to load user data.', 'Close', { duration: 3000 });
    }
  }

  loadRecentOutfits(): void {
    if (!this.currentUser?.id) return;

    this.outfitService.getOutfitsByUser(this.currentUser.id).subscribe({
      next: (outfits) => {
        this.recentOutfits = outfits.slice(0, 4);
        this.totalOutfits = outfits.length;
      },
      error: () => {
        this.snackBar.open('Failed to load outfits.', 'Close', { duration: 3000 });
      }
    });
  }
}
