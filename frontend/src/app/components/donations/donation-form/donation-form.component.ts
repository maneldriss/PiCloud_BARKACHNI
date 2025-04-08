
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Donation, DonationType } from '../../../models/donation';
import { DonationService } from '../../../services/donation.service';
import { ItemDressing } from '../../../models/item-dressing';
import { ItemDressingService } from '../../../services/item-dressing.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

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
  availableItems: ItemDressing[] = [];

  constructor(
    private fb: FormBuilder,
    private donationService: DonationService,
    private itemService: ItemDressingService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.donationForm = this.fb.group({
      donationType: ['', Validators.required],
      amount: [0, [Validators.min(0.01)]],
      itemDressing: [null]
    });
  }

 
ngOnInit(): void {
  const idParam = this.route.snapshot.params['id'];
  this.donationId = idParam ? Number(idParam) : undefined;
  this.isEditMode = !!this.donationId;

  if (this.isEditMode) {
    if (typeof this.donationId !== 'number' || isNaN(this.donationId)) {
      this.error = "Invalid donation ID";
      return;
    }
  }

  this.loadAvailableItems(() => {
    if (this.isEditMode) {
      this.loadDonationDetails();
    }
  });

  this.donationForm.get('donationType')?.valueChanges.subscribe(type => {
    this.updateFormValidation(type);
  });
}

  updateFormValidation(type: DonationType): void {
    const amountControl = this.donationForm.get('amount');
    const itemControl = this.donationForm.get('itemDressing');

    if (type === DonationType.MONEY) {
      amountControl?.setValidators([Validators.required, Validators.min(0.01)]);
      itemControl?.clearValidators();
    } else {
      amountControl?.clearValidators();
      itemControl?.setValidators([Validators.required]);
    }

    amountControl?.updateValueAndValidity();
    itemControl?.updateValueAndValidity();
  }

  loadAvailableItems(callback?: () => void): void {
    this.itemService.getAvailableItems().subscribe(items => {
      this.availableItems = items;
      if (callback) callback();
    });
  }

 /* loadDonationDetails(): void {
    if (!this.donationId) return;

    this.loading = true;
    this.donationService.getDonationById(this.donationId).subscribe({
      next: (donation) => {
        this.donationForm.patchValue({
          donationType: donation.donationType,
          amount: donation.amount,
          // Ensure items are loaded before patching
          itemDressing: this.availableItems.find(item => 
            item.itemID === donation.itemDressing?.itemID
          )
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load donation details.';
        this.loading = false;
        console.error(err);
      }
    });
  }*/
    loadDonationDetails(): void {
      if (!this.donationId) return;
    
      this.loading = true;
      this.donationService.getDonationById(this.donationId).subscribe({
        next: (donation) => {
          // Trouver l'item correspondant dans availableItems
          const matchedItem = this.availableItems.find(item => 
            item.itemID === donation.itemDressing?.itemID
          );
    
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
  
    /*onSubmit(): void {
      if (this.donationForm.invalid) return;
    
      this.loading = true;
      const formData = this.donationForm.value;
      const userId = 1;
    
      const donationData: Donation = {
        donationId: this.donationId, // Ajout crucial pour l'édition
        donationType: formData.donationType,
        amount: formData.donationType === DonationType.MONEY ? formData.amount : null,
        itemDressing: formData.donationType === DonationType.CLOTHING 
          ? this.availableItems.find(item => item.itemID === formData.itemDressing.itemID)
          : null
      };
    
      if (this.isEditMode) {
        this.donationService.updateDonation(donationData).subscribe({
          next: () => {
            this.router.navigate(['/donations']);
            this.loading = false;
          },
          error: (err) => {
            console.error('Update Error:', err);
            this.error = 'Échec de la mise à jour: ' + (err.error?.message || err.message);
            this.loading = false;
          }
        });
      } else {
        this.donationService.addDonation(donationData, userId).subscribe({
          next: () => this.router.navigate(['/donations']),
          error: (err) => {
            this.error = 'Échec de la création: ' + err.message;
            this.loading = false;
          }
        });
      }
    }*/
   // donation-form.component.ts
// donation-form.component.ts
onSubmit(): void {
  if (this.donationForm.invalid) return;

  const formData = this.donationForm.value;
  const payload: Donation = {
    donationId: this.donationId,
    donationType: formData.donationType,
    amount: formData.donationType === DonationType.MONEY 
      ? parseFloat(formData.amount)
      : undefined, // Utilisation de undefined au lieu de null
    itemDressing: formData.donationType === DonationType.CLOTHING
      ? {
          itemID: formData.itemDressing.itemID,
          itemName: formData.itemDressing.itemName
        }
      : undefined
  };

  if (this.isEditMode) {
    this.donationService.updateDonation(payload).subscribe({
      next: () => this.handleSuccess(),
      error: (err) => this.handleError(err)
    });
  } else {
    this.loading = true;
    const userId = 1; // Remplacer par l'ID utilisateur réel
    
    this.donationService.addDonation(payload, userId).subscribe({
      next: () => {
        this.router.navigate(['/donations']);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors de la création : ' + 
          (err.error?.message || err.message || 'Erreur inconnue');
        this.loading = false;
      }
    });
  }
}
private handleSuccess(): void {
  this.router.navigate(['/donations']);
  this.loading = false;
}

private handleError(err: any): void {
  console.error('Error:', err);
  this.error = err.error?.message || err.message || 'Unknown error occurred';
  this.loading = false;
}
private sanitizeFormData(formData: any): Donation {
  return {
    ...formData,
    itemDressing: formData.donationType === DonationType.CLOTHING 
      ? { itemID: formData.itemDressing.itemID }
      : null,
    amount: formData.donationType === DonationType.MONEY 
      ? parseFloat(formData.amount.toFixed(2))
      : null
  };
}

  get donationTypeControl() { return this.donationForm.get('donationType'); }
  get amountControl() { return this.donationForm.get('amount'); }
  get itemDressingControl() { return this.donationForm.get('itemDressing'); }
}