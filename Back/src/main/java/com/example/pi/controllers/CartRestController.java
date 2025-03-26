package com.example.pi.controllers;

import com.example.pi.entities.cart;
import com.example.pi.entities.item;
import com.example.pi.entities.user;
import com.example.pi.services.IServiceCart;
import com.example.pi.services.IServiceCommande;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/cart")
public class CartRestController {
    @Autowired
    IServiceCart CartService;

    // http://localhost:8089/tpfoyer/chambre/retrieve-all-chambres
    @GetMapping("/retrieve-all-carts")
    public List<cart> getcarts() {
        List<cart> listcarts = CartService.retrieveAllcarts();
        return listcarts;
    }
    @GetMapping("/retrieve-all-users")
    public List<user> getusers() {
        List<user> listusers = CartService.retrieveAllusers();
        return listusers;
    }
    @GetMapping("/retrieve-all-items")
    public List<item> getitems() {
        List<item> listitems = CartService.retrieveAllitems();
        return listitems;
    }
    // http://localhost:8089/tpfoyer/cart/retrieve-cart/8
    @GetMapping("/retrieve-cart/{cart-id}")
    public cart retrievecart(@PathVariable("cart-id") Long chId) {
        cart cart = CartService.retrievecart(chId);
        return cart;
    }
    @PostMapping("/add-cart")
    public cart addcart(@RequestBody cart c) {
        cart cart = CartService.addcart(c);
        return cart;
    }
    // http://localhost:8089/tpfoyer/cart/remove-cart/{cart-id}
    @DeleteMapping("/remove-cart/{cart-id}")
    public void removecart(@PathVariable("cart-id") Long chId) {
        CartService.removecart(chId);
    }
    // http://localhost:8089/tpfoyer/cart/modify-cart
    @PutMapping("/modify-cart")
    public cart modifycart(@RequestBody cart c) {
        return  CartService.modifycart(c);

    }
    @PutMapping("/affecter-user-a-cart/{cart-id}/{user-id}")
    public void assignUserToCart(@PathVariable("cart-id") Long cartId,
                                                 @PathVariable("user-id") Long userId) {
        CartService.assignUserToCart(cartId,userId);
    }
    @PutMapping("/add-item-to-cart/{cartId}/{itemId}")
    public ResponseEntity<String> addItemToCart(@PathVariable Long cartId, @PathVariable Long itemId) {
        CartService.addItemToCart(cartId, itemId);
        return ResponseEntity.ok("Item added to cart successfully.");
    }
    @DeleteMapping("/remove-item-from-cart/{cartId}/{itemId}")
    public ResponseEntity<String> removeItemFromCart(@PathVariable Long cartId, @PathVariable Long itemId) {
        CartService.removeItemFromCart(cartId, itemId);
        return ResponseEntity.ok("Item removed from cart successfully.");
    }

}
