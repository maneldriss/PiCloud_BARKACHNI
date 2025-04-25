package com.barkachni.barkachni.controllers;


import com.barkachni.barkachni.Services.cart.IServiceCart;
import com.barkachni.barkachni.entities.cart.Cartitem;
import com.barkachni.barkachni.entities.cart.cart;
import com.barkachni.barkachni.entities.user.User;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@AllArgsConstructor
@RequestMapping("/cart")
public class CartRestController {

    @Autowired
    private IServiceCart cartService;

    @GetMapping("/retrieve-all-carts")
    public List<cart> getCarts() {
        return cartService.retrieveAllcarts();
    }

    @GetMapping("/retrieve-all-users")
    public List<User> getUsers() {
        return cartService.retrieveAllusers();
    }

    @GetMapping("/retrieve-all-items")
    public List<Cartitem> getItems() {
        return cartService.retrieveAllitems();
    }

    @GetMapping("/retrieve-cart/{cart-id}")
    public cart retrieveCart(@PathVariable("cart-id") Long cartId) {
        return cartService.retrievecart(cartId);
    }

    @PostMapping("/add-cart")
    public cart addCart(@RequestBody cart c) {
        return cartService.addcart(c);
    }

    @DeleteMapping("/remove-cart/{cart-id}")
    public void removeCart(@PathVariable("cart-id") Long cartId) {
        cartService.removecart(cartId);
    }

    @PutMapping("/modify-cart")
    public cart modifyCart(@RequestBody cart c) {
        return cartService.modifycart(c);
    }

    @PutMapping("/assign-user-to-cart/{cart-id}/{user-id}")
    public void assignUserToCart(@PathVariable("cart-id") Long cartId,
                                 @PathVariable("user-id") Integer userId) {
        cartService.assignUserToCart(cartId, userId);
    }

    // Add existing Cartitem to cart
    @PutMapping("/add-item-to-cart/{cartId}/{itemId}")
    public ResponseEntity<cart> addItemToCart(@PathVariable Long cartId, @PathVariable Long itemId) {
        cartService.addItemToCart(cartId, itemId);
        return ResponseEntity.ok(cartService.retrievecart(cartId));
    }

    // Add product directly to cart (and create Cartitem)
    @PostMapping("/add-product-to-cart/{cartId}/{productId}/{quantity}")
    public ResponseEntity<cart> addProductToCart(@PathVariable Long cartId,
                                                 @PathVariable Long productId,
                                                 @PathVariable int quantity) {
        cartService.addProductToCart(cartId, productId, quantity);
        return ResponseEntity.ok(cartService.retrievecart(cartId));
    }

    // Update item quantity in cart
    @PutMapping("/update-item-quantity/{cartId}/{itemId}/{quantity}")
    public ResponseEntity<cart> updateItemQuantity(@PathVariable Long cartId,
                                                   @PathVariable Long itemId,
                                                   @PathVariable int quantity) {
        cartService.updateItemQuantity(cartId, itemId, quantity);
        return ResponseEntity.ok(cartService.retrievecart(cartId));
    }

    @DeleteMapping("/remove-item-from-cart/{cartId}/{itemId}")
    public ResponseEntity<cart> removeItemFromCart(@PathVariable Long cartId,
                                                   @PathVariable Long itemId) {
        cartService.removeItemFromCart(cartId, itemId);
        return ResponseEntity.ok(cartService.retrievecart(cartId));
    }
    @GetMapping("/total/{cartId}")
    public double getCartTotal(@PathVariable Long cartId) {
        return cartService.getCartTotal(cartId);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<cart> getCartByUserId(@PathVariable Integer userId) {
        cart userCart = cartService.retrieveCartByUserId(userId);
        return ResponseEntity.ok(userCart);
    }


}
