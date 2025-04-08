import { Component, OnInit } from '@angular/core';
import { Donation, DonationType } from '../../../models/donation';
import { DonationService } from '../../../services/donation.service';

@Component({
  selector: 'app-donation-list',
  templateUrl: './donation-list.component.html',
  styleUrls: ['./donation-list.component.css']
})
export class DonationListComponent implements OnInit {
  donations: Donation[] = [];
  filteredDonations: Donation[] = [];
  loading = true;
  error = '';
  Math = Math;
  // Pagination
  currentPage = 1;
  itemsPerPage = 6; // Changé à 6 éléments par page
  
  // Filtres et tri
  searchType: string = '';
  sortField: string = '';
  sortDesc = false;
  donationTypes = Object.values(DonationType);

  constructor(private donationService: DonationService) { }

  ngOnInit(): void {
    this.loadDonations();
  }
  toggleSort(field: string): void {
    if (this.sortField === field) {
      this.sortDesc = !this.sortDesc;
    } else {
      this.sortField = field;
      this.sortDesc = false;
    }
    this.applyFilters();
  }
  loadDonations(): void {
    this.loading = true;
    this.error = '';
    
    this.donationService.getAllDonations().subscribe({
      next: (donations) => {
        this.donations = donations;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur détaillée:', err);
        this.error = 'Failed to load donations';
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    // Filtrage par type
    this.filteredDonations = this.donations.filter(donation => 
      !this.searchType || donation.donationType === this.searchType
    );
    
    // Tri
    if (this.sortField) {
      this.filteredDonations.sort((a, b) => {
        const valA = a[this.sortField as keyof Donation];
        const valB = b[this.sortField as keyof Donation];
        
        if (valA == null) return 1;
        if (valB == null) return -1;
        
        return this.sortDesc 
          ? (valA < valB ? 1 : -1) 
          : (valA > valB ? 1 : -1);
      });
    }
    
    this.currentPage = 1;
  }

  // Méthodes de pagination
  get totalPages(): number {
    return Math.ceil(this.filteredDonations.length / this.itemsPerPage);
  }

  get paginatedDonations(): Donation[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredDonations.slice(startIndex, startIndex + this.itemsPerPage);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
  getDonationTypeDisplay(type: string): string {
    return type === 'MONEY' ? 'Financial Donation' : 'Clothing Donation';
  }
  
  getDonationIcon(type: string): string {
    return type === 'MONEY' ? 'fa-money-bill-wave' : 'fa-tshirt';
  }
  goToPage(page: number): void {
    this.currentPage = page;
  }

  getPages(): number[] {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }
  

  deleteDonation(id: number | undefined): void {
    if (!id) return;
    
    if (confirm('Are you sure you want to delete this donation?')) {
      this.donationService.deleteDonation(id).subscribe({
        next: () => {
          this.loadDonations();
        },
        error: (err) => {
          this.error = 'Failed to delete donation. Please try again later.';
          console.error(err);
        }
      });
    }
  }}