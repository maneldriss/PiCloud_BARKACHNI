import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Donation, DonationStatus, DonationType } from '../../../models/donation';
import { DonationService } from '../../../services/donation.service';
import {Item} from "../../../models/Dressing/item.model";
import {ItemService} from "../../../services/Dressing/item.service";
import { AuthService } from '../../../services/auth/auth.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-donation-form',
  templateUrl: './donation-form.component.html',
  styleUrls: ['./donation-form.component.css']
})
export class DonationFormComponent implements OnInit {
  donationForm: FormGroup;
  isEditMode = false;
  donationId?: number;
  loading = false;
  error = '';
  donationTypes = Object.values(DonationType);
  availableItems: Item[] = [];
  userId = 1;
  selectedItem: Item | null = null;

  constructor(
    private fb: FormBuilder,
    private donationService: DonationService,
    private itemService: ItemService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.donationForm = this.fb.group({
      donationType: ['', Validators.required],
      amount: [0, [Validators.min(0.01), Validators.max(999999)]],      itemDressing: [null]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.params['id'];
    this.donationId = idParam ? Number(idParam) : undefined;
    this.isEditMode = !!this.donationId;

    if (this.isEditMode && isNaN(this.donationId!)) {
      this.error = "Invalid donation ID";
      return;
    }

    // Get the current user's ID
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.userId = currentUser.id;
      console.log('Current user ID:', this.userId);
      this.loadAvailableItems(() => {
        if (this.isEditMode) this.loadDonationDetails();
      });
    } else {
      this.error = 'User not authenticated';
    }

    this.donationForm.get('donationType')?.valueChanges.subscribe(type => {
      this.updateFormValidation(type);
      if (type !== DonationType.CLOTHING) this.selectedItem = null;
    });
  }

  // Méthodes pour la galerie d'images
  selectItem(item: Item): void {
    this.selectedItem = item;
    this.donationForm.patchValue({ itemDressing: item });
  }

  getItemImage(item: Item): string {
    if (!item?.imageUrl) return '';

    if (item.imageUrl.startsWith('http')) {
      return item.imageUrl.replace('localhost:8080', 'localhost:8088');
    }

    if (item.imageUrl.startsWith('assets/')) {
      return item.imageUrl;
    }

    if (item.imageUrl.includes('\\')) {
      const filename = item.imageUrl.split('\\').pop();
      return `assets/images/${filename}`;
    }

    return `assets/images/${item.imageUrl}`;
  }

  isItemSelected(item: Item): boolean {
    return this.selectedItem?.itemID === item.itemID;
  }

  // Méthodes existantes optimisées
  updateFormValidation(type: DonationType): void {
    const amountControl = this.donationForm.get('amount');
    const itemControl = this.donationForm.get('itemDressing');

    if (type === DonationType.MONEY) {
      amountControl?.setValidators([Validators.required, Validators.min(0.01),  // Minimum value of 0.01
        Validators.max(999999)]);
      itemControl?.clearValidators();
    } else {
      amountControl?.clearValidators();
      itemControl?.setValidators([Validators.required]);
    }

    amountControl?.updateValueAndValidity();
    itemControl?.updateValueAndValidity();
  }

  loadAvailableItems(callback?: () => void): void {
    console.log('Loading items for user ID:', this.userId);
    this.itemService.getItemsByUser(this.userId).subscribe({
      next: items => {
        console.log('All items received:', items);
        // Filter items that aren't in any outfits
        this.availableItems = items.filter(item => {
          const isNotInOutfit = !item.outfits || item.outfits.length === 0;
          console.log('Item:', item.itemName, {
            userID: item.user?.userID,
            currentUserId: this.userId,
            outfits: item.outfits,
            isNotInOutfit
          });
          return isNotInOutfit;
        });
        console.log('Filtered available items:', this.availableItems);
        callback?.();
      },
      error: err => {
        console.error('Error loading items:', err);
        this.handleError(err);
      }
    });
  }

  loadDonationDetails(): void {
    if (!this.donationId) return;

    this.loading = true;
    this.donationService.getDonationById(this.donationId).subscribe({
      next: (donation) => {
        const matchedItem = this.availableItems.find(item =>
          item.itemID === donation.itemDressing?.itemID
        );

        if (matchedItem) {
          this.selectedItem = {
            itemID: matchedItem.itemID,
            itemName: matchedItem.itemName,
            imageUrl: matchedItem.imageUrl,
            brand: matchedItem.brand,
            size: matchedItem.size,
            color: matchedItem.color,
            category: matchedItem.category,
          };
        }

        this.donationForm.patchValue({
          donationType: donation.donationType,
          amount: donation.amount,
          itemDressing: matchedItem || null
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load donation details.';
        this.loading = false;
      }
    });
  }
  onSubmit(): void {
    if (this.donationForm.invalid) return;

    const formData = this.donationForm.value;
    if (formData.donationType === DonationType.MONEY && formData.amount <= 0) {
      this.error = 'Amount must be a positive number';
      return;
    }

    // Construction du payload selon les exigences du backend
    const payload: any = {
      donationType: formData.donationType,
      status: DonationStatus.PENDING
    };

    if (formData.donationType === DonationType.MONEY) {
      payload.amount = parseFloat(formData.amount);
      payload.itemDressing = null; // Explicitement null pour MONEY
    }
    else if (formData.donationType === DonationType.CLOTHING) {
      if (!this.selectedItem) {
        this.error = 'Please select an item';
        return;
      }

      // Make sure we're passing the complete item object with itemID
      payload.itemDressing = {
        itemID: this.selectedItem.itemID,
        itemName: this.selectedItem.itemName,
        category: this.selectedItem.category,
        size: this.selectedItem.size,
        color: this.selectedItem.color,
        brand: this.selectedItem.brand,
        imageUrl: this.selectedItem.imageUrl
      };
    }

    console.log("Payload being sent:", JSON.stringify(payload, null, 2));

    const operation = this.isEditMode && this.donationId
      ? this.donationService.updateDonation({ ...payload, donationId: this.donationId })
      : this.donationService.addDonation(payload, this.userId);

    operation.subscribe({
      next: () => this.handleSuccess(),
      error: (err) => {
        console.error("Complete error:", err);
        this.error = err.error?.message ||
                   err.error?.error ||
                   'Error while submitting donation';
        this.loading = false;
      }
    });
  }
  private handleSuccess(): void {
    this.router.navigate(['/donations'], {
      state: { donationUpdated: true }
    });
  }

  private handleError(err: any): void {
    console.error('Error:', err);
    this.error = err.error?.message || err.message || 'Operation failed';
    this.loading = false;
  }

  // Getters pour les contrôles du formulaire
  get donationTypeControl() { return this.donationForm.get('donationType'); }
  get amountControl() { return this.donationForm.get('amount'); }
  get itemDressingControl() { return this.donationForm.get('itemDressing'); }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    const parent = img.parentElement;
    if (parent) {
      parent.style.backgroundColor = '#f8f9fa';
      parent.style.display = 'flex';
      parent.style.alignItems = 'center';
      parent.style.justifyContent = 'center';
      parent.innerHTML = '<i class="fas fa-image text-muted" style="font-size: 2rem;"></i>';
    }
  }
}
