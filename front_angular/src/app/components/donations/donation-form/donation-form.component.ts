import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Donation, DonationStatus, DonationType } from '../../../models/donation';
import { DonationService } from '../../../services/donation.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Item } from 'src/app/models/Dressing/item.model';
import { ItemService } from 'src/app/services/Dressing/item.service';

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
  currentUserId: number |null=null;
  selectedItem: Item | null = null;

  constructor(
    private fb: FormBuilder,
    private donationService: DonationService,
    private itemService: ItemService,
    private router: Router,
    private route: ActivatedRoute,
    private authService:AuthService
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
    this.getCurrentUserId();

    if (this.isEditMode && isNaN(this.donationId!)) {
      this.error = "Invalid donation ID";
      return;
    }

    this.loadAvailableItems(() => {
      if (this.isEditMode) this.loadDonationDetails();
    });

    this.donationForm.get('donationType')?.valueChanges.subscribe(type => {
      this.updateFormValidation(type);
      if (type !== DonationType.CLOTHING) this.selectedItem = null;
    });
  }

  getCurrentUserId():void{
    this.currentUserId=this.authService.getCurrentUser()?.id ?? null;
  }
  // Méthodes pour la galerie d'images
  selectItem(item: Item): void {
    this.selectedItem = item;
    this.donationForm.patchValue({ itemDressing: item });
  }

  getItemImage(item: Item): string {
    if (!item?.imageUrl) return 'assets/images/default-item.jpg';
    
    if (item.imageUrl.startsWith('http') || item.imageUrl.startsWith('assets/')) {
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
    this.itemService.getItems().subscribe({
      next: items => {
        this.availableItems = items;
        callback?.();
      },
      error: err => this.handleError(err)
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
    if (!this.currentUserId) {
      this.error = 'Vous devez être connecté pour effectuer un don';
      return;
    }
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
        this.error = 'Veuillez sélectionner un article';
        return;
      }
  
      // Structure minimale attendue par le backend
      payload.itemDressing = {
        itemID: this.selectedItem.itemID
        // Ne pas inclure user ici - le backend le gère
      };
    }
  
    console.log("Payload envoyé :", JSON.stringify(payload, null, 2));
  
    const operation = this.isEditMode && this.donationId
      ? this.donationService.updateDonation({ ...payload, donationId: this.donationId })
      : this.donationService.addDonation(payload, this.currentUserId!);
      console.log(this.currentUserId)
  
    operation.subscribe({
      next: () => this.handleSuccess(),
      error: (err) => {
        console.error("Erreur complète :", err);
        this.error = err.error?.message || 
                   err.error?.error || 
                   'Erreur lors de l\'envoi du don';
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
}