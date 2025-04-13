import { Component, OnInit } from '@angular/core'; 
import { ActivatedRoute, Router } from '@angular/router';
import { CommandeService } from '../services/commande.service';
import { Commande } from '../models/commande';
import { Cart } from '../models/cart';
import { CartService } from '../services/cart.service';
import { PlaceOrderRequest } from '../models/place-order-request'; // Import DTO

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
    commandeitems: [] ,
    total:0,
   
  };

  shippingAddress: string = '';
  shippingMethod: string = '';
  paymentMethod: string = '';

  constructor(
    private route: ActivatedRoute,
    private commandeService: CommandeService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
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
    console.log('Commande before submission:', this.commande);
    // Log the values before submitting to check if they are correct
    console.log('Shipping Address:', this.shippingAddress);
    console.log('Shipping Method:', this.shippingMethod);
    console.log('Payment Method:', this.paymentMethod);
  
    // Prepare the PlaceOrderRequest DTO
    const placeOrderRequest: PlaceOrderRequest = {
      shippingAddress: this.shippingAddress,
      shippingMethod: this.shippingMethod,
      paymentMethod: this.paymentMethod,
    };
  
    // Log the PlaceOrderRequest DTO before sending it
    console.log('PlaceOrderRequest:', placeOrderRequest);
  
    const cartId = this.commande.cart?.cartID; // Get the cart ID dynamically
    if (cartId) {
      console.log('Cart ID:', cartId);
      // Send the order request
      this.commandeService.placeOrder(placeOrderRequest, cartId).subscribe({
        next: (response) => {
          console.log('Order created successfully:', response);
          alert('Order placed successfully!');
          if (response && response.commandeID) {
            this.commande.commandeID = response.commandeID; // Set the commandeID from the response
            this.getTotal(response.commandeID); // Pass the commandeID to getTotal
          } else {
            console.error('Order response does not include commandeID.');
          }
        },
        error: (err) => {
          console.error('Failed to create order:', err);
          alert('An error occurred while placing the order.');
        },
      });
    } else {
      console.error('No cart ID found.');
    }
  }
  
getTotal(commandeID: number): void {
  this.commandeService.getCommandeTotal(commandeID).subscribe({
    next: (total) => {
      console.log('Total fetched successfully:', total);
      this.commande.total = total; // Update the total in the commande object
    },
    error: (err) => {
      console.error('Failed to fetch total:', err);
    },
  });
}}