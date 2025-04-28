import { Component, OnInit } from '@angular/core';
import { Donation, DonationType } from '../../../models/donation';
import { DonationService } from '../../../services/donation.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  itemsPerPage = 6;
  currentUserId: number = 1;
  // Filters and sorting
  searchType: string = '';
  sortField: string = '';
  sortDesc = false;
  donationTypes = Object.values(DonationType);

  constructor(private donationService: DonationService,
  private snackBar: MatSnackBar
  ) { }

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
    
    console.log('Starting to load donations...'); // Debug
    
    this.donationService.getAllDonations().subscribe({
      next: (donations) => {
        console.log('Raw donations data:', donations); // Debug
        this.donations = donations;
        console.log('Donations assigned:', this.donations); // Debug
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading donations:', err); // Debug
        this.error = 'Failed to load donations';
        this.loading = false;
      }
    });
  }
  
  get paginatedDonations(): Donation[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    const result = this.filteredDonations.slice(start, end);
    console.log('Paginated data:', result); // Debug
    return result;
  }

  applyFilters(): void {
    console.log('Donations avant filtrage:', this.donations); // Debug
    this.filteredDonations = this.donations.filter(donation => 
      !this.searchType || donation.donationType === this.searchType
    );
    console.log('Donations après filtrage:', this.filteredDonations); // Debug
    
    if (this.sortField) {
      this.filteredDonations.sort((a, b) => {
        const valA = a[this.sortField as keyof Donation];
        const valB = b[this.sortField as keyof Donation];
        return this.compareValues(valA, valB);
      });
    }
    
    this.currentPage = 1;
  }
  private compareValues(a: any, b: any): number {
    if (a == null) return 1;
    if (b == null) return -1;
    return this.sortDesc ? (a < b ? 1 : -1) : (a > b ? 1 : -1);
  }
  // Pagination methods
  get totalPages(): number {
    return Math.ceil(this.filteredDonations.length / this.itemsPerPage);
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

  deleteDonation(id: number): void {
    if (!id) {
      console.error('Invalid donation ID');
      return;
    }
  
    if (confirm('Are you sure you want to delete this donation?')) {
      this.donationService.deleteDonation(id).subscribe({
        next: () => {
          // 1. Mise à jour locale des listes
          this.donations = this.donations.filter(d => d.donationId !== id);
          this.filteredDonations = this.filteredDonations.filter(d => d.donationId !== id);
          
          // 2. Ajustement de la pagination si nécessaire
          if (this.paginatedDonations.length === 0 && this.currentPage > 1) {
            this.currentPage--;
          }
  
          // 3. Notifier la suppression pour mettre à jour le leaderboard
          this.donationService.notifyUpdates();
          
          // 4. Optionnel: Afficher un message de confirmation
          this.snackBar.open('Donation deleted successfully!', 'Close', {
            duration: 3000
          });
        },
        error: (err) => {
          console.error('Error deleting donation:', err);
          this.snackBar.open('Failed to delete donation', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  addNewDonation(newDonation: Donation) {
    this.donationService.addDonation(newDonation, this.currentUserId).subscribe({
      next: (addedDonation) => {
        this.donations = [...this.donations, addedDonation];
        this.loadDonations();
      },
      error: (err) => console.error('Error adding donation:', err)
    });
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/default-item.jpg';
    // Maintain the image dimensions and avoid layout shift to prevent flickering
    img.style.width = '100%';
    img.style.height = 'auto';
    img.style.maxHeight = '170px';
    img.style.objectFit = 'contain';
  }

  getItemImageUrl(item: any): string {
    if (!item?.imageUrl) return 'assets/images/default-item.jpg';
    
    // Check for full URLs
    if (item.imageUrl.startsWith('http')) {
      return item.imageUrl;
    }
    
    // Handle Windows paths
    if (item.imageUrl.includes('\\')) {
      const filename = item.imageUrl.split('\\').pop();
      return filename ? `assets/images/${filename}` : 'assets/images/default-item.jpg';
    }
    
    // Handle relative paths
    if (item.imageUrl.startsWith('assets/')) {
      return item.imageUrl;
    }
    
    // Handle just filenames
    return `assets/images/${item.imageUrl}`;
  }
 // Modifiez les méthodes
 approveDonation(id: number): void {
  if (confirm('Are you sure?')) {
    this.donationService.approveDonation(id).subscribe({
      next: () => {
        this.snackBar.open('Success', 'Close', { duration: 3000 });
        this.loadDonations(); // Recharge les données
      },
      error: (err) => console.error(err)
    });
  }
}

rejectDonation(id: number): void {
  if (confirm('Are you sure you want to reject this donation?')) {
    this.donationService.rejectDonation(id).subscribe({
      next: () => {
        this.snackBar.open('Donation rejected - notification sent', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.loadDonations(); // Recharge la liste
      },
      error: (err) => {
        this.snackBar.open('Error rejecting donation', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
}