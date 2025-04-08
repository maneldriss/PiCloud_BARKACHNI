import { Component, OnInit } from '@angular/core';
import { ItemDressingService } from '../../services/item-dressing.service';
import { ItemDressing } from '../../models/item-dressing';
import { DonationService } from '../../services/donation.service';
import { Donation } from '../../models/donation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  donations: Donation[] = [];
  recentDonations: Donation[] = [];
  availableItems: ItemDressing[] = [];
  loading = true;
  error = '';

  constructor(
    private donationService: DonationService,
    private itemService: ItemDressingService
  ) {}

  ngOnInit(): void {
    this.loadDonations();
    this.loadAvailableItems();
  }

  private loadDonations(): void {
    this.donationService.getAllDonations().subscribe({
      next: (donations) => {
        this.donations = donations;
        this.recentDonations = donations.slice(-3).reverse();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des dons';
        this.loading = false;
        console.error(err);
      }
    });
  }

  private loadAvailableItems(): void {
    this.itemService.getAvailableItems().subscribe({
      next: (items) => {
        this.availableItems = items;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des articles:', err);
      }
    });
  }

  get recentMoneyDonations(): Donation[] {
    return this.donations
      .filter(d => d.donationType === 'MONEY')
      .slice(0, 3);
  }

  get recentClothingDonations(): Donation[] {
    return this.donations
      .filter(d => d.donationType === 'CLOTHING')
      .slice(0, 3);
  }

  getTotalDonations(): number {
    return this.donations
      .filter(d => d.donationType === 'MONEY')
      .reduce((sum, current) => sum + (current.amount || 0), 0);
  }

  getDonationTypeDisplay(type: string): string {
    return type === 'MONEY' ? 'Financier' : 'Vêtements';
  }

  getDonationIcon(type: string): string {
    return type === 'MONEY' ? 'fa-money-bill-wave' : 'fa-tshirt';
  }
}