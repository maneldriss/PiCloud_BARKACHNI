import { Component, OnInit } from '@angular/core';
import { CommandeService } from '../services/commande.service';
import { Commande } from '../models/commande';

@Component({
  selector: 'app-commande-back',
  templateUrl: './commande-back.component.html',
  styleUrls: ['./commande-back.component.css'],
})
export class CommandeBackComponent implements OnInit {
  commandes: Commande[] = [];
  loading: boolean = false;
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  selectedCommande: Commande | null = null;

  constructor(private commandeService: CommandeService) {}

  ngOnInit(): void {
    this.loadCommandes();
  }

  loadCommandes(): void {
    this.loading = true;
    this.commandeService.getAllCommandes().subscribe(
      (data) => {
        this.commandes = data;
        this.loading = false;
      },
      (error) => {
        console.error('Error loading commandes:', error);
        this.loading = false;
      }
    );
  }

  viewCommande(commandeId: number): void {
    // Logic to view commande details
  }

  editCommande(commandeId: number): void {
    this.commandeService.getCommandeById(commandeId).subscribe(
      (commande) => {
        this.selectedCommande = commande;
        this.showEditModal = true;
      },
      (error) => console.error('Error fetching commande:', error)
    );
  }

  deleteCommande(commandeId: number): void {
    this.commandeService.removeCommande(commandeId).subscribe(
      () => {
        this.commandes = this.commandes.filter((cmd) => cmd.commandeID !== commandeId);
      },
      (error) => console.error('Error deleting commande:', error)
    );
  }

  openAddCommandeModal(): void {
    this.selectedCommande = {
      commandeID: null,
      cart: null,
      shippingAddress: '',
      status: '',
      paymentStatus: '',
      paymentMethod: '',
      shippingMethod: '',
      shippingCost: 0,
      commandeitems: [],
      total: 0,
    }; // Default values for a new commande
    this.showAddModal = true;
  }
  
  

  

  closeAddCommandeModal(): void {
    this.showAddModal = false;
    this.loadCommandes();
  }

  closeEditCommandeModal(): void {
    this.showEditModal = false;
    this.loadCommandes();
  }
}
