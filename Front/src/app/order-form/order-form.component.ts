import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommandeService } from '../services/commande.service';
import { Commande } from '../models/commande';
import { Cart } from '../models/commande';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css'],
})
export class OrderFormComponent implements OnInit {
  commande: Commande = {
    commandeID: null,
    cart: null, // This will be populated dynamically
    shippingAddress: '',
    status: 'Pending',
    paymentStatus: 'Unpaid',
    paymentMethod: '',
    shippingMethod: '',
    shippingCost: 0,
  };

  constructor(
    private route: ActivatedRoute,
    private commandeService: CommandeService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
   
      console.log('OrderFormComponent initialized');
    
    
    const cartId = this.route.snapshot.paramMap.get('cartId');
    if (cartId) {
      this.cartService.getCartById(parseInt(cartId, 10)).subscribe({
        next: (cart) => {
          this.commande.cart = cart; // Assign the retrieved cart details to the commande
        },
        error: (err) => console.error('Failed to fetch cart:', err),
      });
    }
  }

  submitCommande(): void {
    console.log('Submitting order:', this.commande);  // Log the request payload
    this.commandeService.addCommande(this.commande).subscribe({
      next: (response) => {
        console.log('Order created successfully:', response);
        alert('Order placed successfully!');
        // Redirect or clear form if needed
      },
      error: (err) => {
        console.error('Failed to create order:', err);
        alert('An error occurred while placing the order.');
      },
    });
  }
  
  
}
