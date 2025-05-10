import { Component, OnInit } from '@angular/core'; 
import { ActivatedRoute, Router } from '@angular/router';
import { CommandeService } from '../services/commande.service';
import { Commande } from '../models/commande';
import { Cart } from '../models/cart';
import { CartService } from '../services/cart.service';
import { PlaceOrderRequest } from '../models/place-order-request';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css'],
})
export class OrderFormComponent implements OnInit {
  commande: Commande = {
    commandeID: null,
    cart: null,
    shippingAddress: '',
    status: 'Pending',
    paymentStatus: 'Unpaid',
    paymentMethod: '',
    shippingMethod: '',
    shippingCost: 0,
    commandeitems: [],
    total: 0,
  };

  shippingAddress: string = '';
  shippingMethod: string = '';
  paymentMethod: string = '';
  showWheel: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private commandeService: CommandeService,
    private router: Router,
    private cartService: CartService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    const cartId = this.route.snapshot.paramMap.get('cartId');
    if (cartId) {
      this.cartService.getCartById(parseInt(cartId, 10)).subscribe({
        next: (cart) => {
          this.commande.cart = cart;
          if (cart?.total) {
            this.commande.total = cart.total;
          }
        },
        error: (err) => console.error('Failed to fetch cart:', err),
      });
    }
  }

  submitCommande(): void {
    console.log('Commande before submission:', this.commande);
    const cart = this.commande.cart;
  
    if (cart && cart.cartitems && cart.cartitems.length >= 2) {
      this.showWheel = true;
    } else {
      this.proceedWithOrder();
    }
  }

  applyRewardAndProceed(reward: string): void {
    console.log('Applying reward:', reward);
    let discountValue = 0;
    let discountType = '';

    // Handle the match() potentially returning null
    const discountMatch = reward.match(/\d+/);
    if (reward.includes('% Discount') && discountMatch) {
      discountValue = parseInt(discountMatch[0], 10);
      discountType = 'percentage';
      this.commande.total = this.commande.total * (1 - discountValue/100);
    } else if (reward === 'Free Shipping') {
      this.commande.shippingCost = 0;
    }

   
    this.proceedWithOrder(discountValue, discountType);
  }

  proceedWithOrder(discountValue: number = 0, discountType: string = ''): void {
    const placeOrderRequest: PlaceOrderRequest = {
      shippingAddress: this.shippingAddress,
      shippingMethod: this.shippingMethod,
      paymentMethod: this.paymentMethod,
      discountApplied: discountValue,
      discountType: discountType
    };

    const cartId = this.commande.cart?.cartID;
    if (cartId) {
      this.commandeService.placeOrder(placeOrderRequest, cartId).subscribe({
        next: (response) => {
          console.log('Order created successfully:', response);
          if (response.commandeID) {
            this.commande.commandeID = response.commandeID;
            this.getTotal(response.commandeID);
            setTimeout(() => {
              this.router.navigate(['/payment'], { queryParams: { total: this.commande.total  ,commandeId:this.commande.commandeID} });
            }, 700);  
          } else {
            console.error('Order response does not include commandeID');
          }
        },
        error: (err) => console.error('Failed to create order:', err)
      });
    }
  }
  
  closeWheel(): void {
    this.showWheel = false;
    console.log('Spin wheel modal closed');
  }
  
  getTotal(commandeID: number): void {
    if (!commandeID) {
      console.error('Invalid commandeID');
      return;
    }
    
    this.commandeService.getCommandeTotal(commandeID).subscribe({
      next: (total) => {
        console.log('Total fetched successfully:', total);
        this.commande.total = total;
      },
      error: (err) => {
        console.error('Failed to fetch total:', err);
      },
    });
  }
}