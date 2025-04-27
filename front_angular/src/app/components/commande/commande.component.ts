import { Component, OnInit } from '@angular/core';
import { Commande } from 'src/app/models/commande';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommandeService } from 'src/app/services/commande.service';


@Component({
  selector: 'app-commande',
  templateUrl: './commande.component.html',
  styleUrls: ['./commande.component.css']
})
export class CommandeComponent implements OnInit {
  commandes: Commande[] = [];
  total: number = 0;
  selectedCommandeId: number = 1; // Example commande ID, dynamically set this
  userId :number | null = null;

  constructor(private commandeService: CommandeService ,private authService: AuthService) {}
  getCurrentUserId(): void {
    const currentUser = this.authService.getCurrentUser();
    console.log("Current user data:", currentUser);
    this.userId = currentUser?.id ?? null;
    console.log("Fetched user ID:", this.userId);
  }
  

  ngOnInit(): void {
    this.getCurrentUserId();
    this.getAllCommandes();
    this.getCommandeTotal();
  }

  // Fetch all commandes
  getAllCommandes(): void {
    this.commandeService.getCommandesByUserId(this.userId!).subscribe(
      (commandes) => {
        this.commandes = commandes;
        console.log('Commandes:', this.commandes);
      },
      (error) => {
        console.error('Error fetching commandes:', error);
      }
    );
  }

  // Fetch total for a specific commande
  getCommandeTotal(): void {
    this.commandeService.getCommandeTotal(this.selectedCommandeId).subscribe(
      (total) => {
        this.total = total;
        console.log('Commande Total:', this.total);
      },
      (error) => {
        console.error('Error fetching total:', error);
      }
    );
  }
 
   // Cancel a commande (remove it)
   cancelCommande(commandeId: any): void {
    this.commandeService.removeCommande(commandeId).subscribe(
      () => {
        console.log(`Commande ${commandeId} canceled successfully`);
        // After cancelling, refresh the list of commandes
        this.getAllCommandes();
      },
      (error) => {
        console.error('Error cancelling commande:', error);
      }
    );
  }
}
