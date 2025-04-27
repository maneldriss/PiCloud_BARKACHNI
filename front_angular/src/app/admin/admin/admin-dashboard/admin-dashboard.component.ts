import { Component, OnDestroy, OnInit } from "@angular/core";
import { Donation, DonationStatus, DonationType } from "src/app/models/donation";
import { DonationService } from "src/app/services/donation.service";
import { Subscription } from "rxjs";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  donations: Donation[] = [];
  loading = false;
  showForm = false;
  currentDonation: Donation | null = null;
  isEditMode = false;
  private updateSubscription!: Subscription;
  currentView: string = 'dashboard';
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  selectedType: string = 'all';
  selectedStatus: string = 'all';
  filteredDonations: Donation[] = [];
  sortAscending: boolean = true;
  showDetailsModal = false;
  ///tawa
  DonationStatus = DonationStatus;
  DonationType = DonationType;
  statusOptions = [
    { value: 'all', label: 'ALL STATUS' },
    { value: DonationStatus.PENDING, label: 'PENDING' },
    { value: DonationStatus.APPROVED, label: 'APPROUVED' },
    { value: DonationStatus.REJECTED, label: 'REJECTED' }
  ];
  typeOptions = [
    { value: 'all', label: 'ALL TYPES' },
    { value: DonationType.MONEY, label: 'MONEY' },
    { value: DonationType.CLOTHING, label: 'CLOTHING' }
  ];
  constructor(private donationService: DonationService) {}

  ngOnInit(): void {
    this.loadDonations();
    this.updateSubscription = this.donationService.donationsUpdated$.subscribe(
      () => this.loadDonations()
    );
  }

  ngOnDestroy(): void {
    this.updateSubscription.unsubscribe();
  }

  setView(view: string): void {
    this.currentView = view;
  }

  showDonations(): void {
    this.currentView = 'donations';
  }
  getPages(): number[] {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;
    
    if (endPage > this.totalPages) {
      endPage = this.totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }
  loadDonations(): void {
    this.loading = true;
    this.donationService.getAllDonations().subscribe({
      next: (donations) => {
        this.donations = donations;
        this.totalItems = donations.length;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading donations:', err);
        this.loading = false;
      }
    });
  }
  applyFilters(): void {
    this.filteredDonations = this.donations.filter(donation => {
      const typeMatch = this.selectedType === 'all' || donation.donationType === this.selectedType;
      const statusMatch = this.selectedStatus === 'all' || donation.status === this.selectedStatus;
      return typeMatch && statusMatch;
    });
    this.totalItems = this.filteredDonations.length;
    this.currentPage = 1; // Reset to first page when filters change
  }
  get paginatedDonations(): Donation[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredDonations.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  generatePdf(donation?: Donation): void {
    const doc = new jsPDF();
    const data = donation ? [donation] : this.filteredDonations;
    
    
    doc.text(donation ? 'Details of donations' : 'List of Donations', 14, 15);
    
    // Tableau
    autoTable(doc, {
      head: [['ID', 'Type', 'Value', 'Status']],
      body: data.map(d => [
        d.donationId,
        this.getDonationTypeLabel(d.donationType),
        d.donationType === DonationType.MONEY 
          ? `${d.amount} DT ` 
          : d.itemDressing?.itemName || '',
        this.getStatusLabel(d.status)
      ]),
      startY: 20
    });

    doc.save(donation ? `don-${donation.donationId}.pdf` : 'DonationListe.pdf');
  }
  approveDonation(donationId: number): void {
    this.donationService.approveDonation(donationId).subscribe({
      next: () => {this.loadDonations(),
      this.closeDetailsModal();
      },
      error: (err) => console.error(err)
    });
  }

  rejectDonation(donationId: number): void {
    if (!donationId) {
      console.error("ID de donation manquant");
      return;
    }

    this.loading = true;
    this.donationService.rejectDonation(donationId).subscribe({
      next: () => {
        const donation = this.donations.find(d => d.donationId === donationId);
        if (donation) {
          donation.status = DonationStatus.REJECTED;
        }
        this.closeDetailsModal(); 
        this.loading = false;
      },
      error: (err) => {
        console.error("Échec du rejet :", err);
        this.loading = false;
      }
    });
  }

  viewDetails(donation: Donation): void {
    this.currentDonation = donation;
    this.showDetailsModal = true;
  }
  
  // Ajoutez cette méthode pour fermer la modale
  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.currentDonation = null;
  }

  private updateStatus(id: number, status: DonationStatus): void {
    const donation = this.donations.find(d => d.donationId === id);
    if (!donation) return;

    const updatedDonation = { ...donation, status };
    this.donationService.updateDonation(updatedDonation).subscribe({
      next: () => {
        donation.status = status;
      },
      error: (err: any) => console.error('Error updating status:', err)
    });
  }

  getDonationTypeLabel(type: DonationType | string): string {
    if (typeof type === 'string') type = type as DonationType;
    
    switch(type) {
      case DonationType.MONEY: return 'MONEY';
      case DonationType.CLOTHING: return 'CLOTHING';
      default: return 'OTHER';
    }
  }
  
  getStatusLabel(status: DonationStatus | string | undefined): string {
    if (!status) return 'Inconnu';
    
    if (typeof status === 'string') {
      status = status.toUpperCase() as DonationStatus;
    }
  
    switch(status) {
      case DonationStatus.PENDING:
      case 'PENDING':
        return 'PENDING';
      case DonationStatus.APPROVED:
      case 'APPROVED':
        return 'APPROVED';
      case DonationStatus.REJECTED:
      case 'REJECTED':
        return 'REJECTED';
      default:
        return 'Inconnu';
    }
    
  }
  sortByType(): void {
    this.filteredDonations.sort((a, b) => {
      const aType = a.donationType.toLowerCase();
      const bType = b.donationType.toLowerCase();
      return this.sortAscending ? aType.localeCompare(bType) : bType.localeCompare(aType);
    });
    this.sortAscending = !this.sortAscending;
  }
  getImageUrl(imagePath: string): string {
    // Si c'est une URL complète, retournez-la directement
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    // Sinon, supposez que c'est un chemin relatif dans assets
    return `assets/images/${imagePath}`;
  } 
 
  
}
