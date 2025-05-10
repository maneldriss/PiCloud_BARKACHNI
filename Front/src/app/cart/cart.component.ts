import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Cart } from '../models/cart';
import { CartItem } from '../models/cartitem';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartId = 1;  // Example cart ID

  cart: Cart | null = null;
  total: number = 0;
  productId: number = 0;
  quantity: number = 1;
  showWheel: boolean = false;

  constructor(private cartService: CartService ,   private router: Router) {}

  ngOnInit(): void {
    this.loadCart();
    this.getTotal();
  }

  loadCart(): void {
    this.cartService.getCartById(this.cartId).subscribe((cart) => {
      this.cart = cart;
      
   
   
    });
  }

  getTotal(): void {
    this.cartService.getCartTotal(this.cartId).subscribe((total) => {
      this.total = total;
    });
  }

  addProductToCart(): void {
    if (this.productId && this.quantity) {
      this.cartService.addProductToCart(this.cartId, this.productId, this.quantity)
        .subscribe(updatedCart => {
          this.cart = updatedCart;
          this.getTotal();
          
          this.router.navigate(['/cart']);
          this.checkWheelDisplay();
        });
        
    }
  }

  updateQuantity(itemId: number, quantity: number): void {
    this.cartService.updateItemQuantity(this.cartId, itemId, quantity).subscribe(updatedCart => {
      this.cart = updatedCart;
      this.getTotal();
    });
  }

  removeItemFromCart(itemId: number): void {
    this.cartService.removeItemFromCart(this.cartId, itemId).subscribe(updatedCart => {
      this.cart = updatedCart;
      this.getTotal();
    });
  }
  redirectToOrderForm(cartId: any): void {
    this.router.navigate(['/order-form', cartId]); // Include cart ID in the URL
  }
  checkWheelDisplay() {
    if (this.cart && this.cart.cartitems.length >= 3) {
      this.showWheel = true;
    } else {
      this.showWheel = false;
    }
  }
  closeWheel(): void {
    this.showWheel = false;
  }
  
  
}
