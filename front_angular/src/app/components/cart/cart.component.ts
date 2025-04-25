import { Component, OnInit } from '@angular/core';


import { Router } from '@angular/router';
import { Cart } from 'src/app/models/cart';
import { Product } from 'src/app/models/product';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CartService } from 'src/app/services/cart.service';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartId = 0;  // Example cart ID
  userId :number | null = null;
  cart: Cart | null = null;
  total: number = 0;
  productId: number = 0;
  quantity: number = 1;
  showWheel: boolean = false;
  recommendations: Product[] = [];
  styleAdvice: string = '';
  showStyleAdvice: boolean = false;
  isLoadingStyleAdvice: boolean = false;
  isLoadingRecommendations = false;

  constructor(private cartService: CartService ,   private router: Router,private authService: AuthService) {}
  getCurrentUserId(): void {
    const currentUser = this.authService.getCurrentUser();
    console.log("Current user data:", currentUser);
    this.userId = currentUser?.id ?? null;
    console.log("Fetched user ID:", this.userId);
  }
  
  ngOnInit(): void {
    this.getCurrentUserId();
    this.getCartId();
   

  }
  getCartId(): void {
    this.cartService.getCartByUserId(this.userId!).subscribe(
      (cart) => {
        this.cartId = cart.cartID;  // Set the cart ID from the fetched cart
        console.log("Fetched cart ID:", this.cartId);

        // Now that we have the cart ID, load the cart and get the total
        this.loadCart();  // Fetch the cart details after setting the cart ID
        this.getTotal();  // Fetch the total after setting the cart ID
      },
      (error) => {
        console.error("Error fetching cart ID:", error);
      }
    );
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
      console.log("Adding product to cart with ID:", this.cartId); // Check if the cartId is correct
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
