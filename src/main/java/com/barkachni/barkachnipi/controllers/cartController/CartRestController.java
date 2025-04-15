package com.barkachni.barkachnipi.controllers.cartController;

import com.barkachni.barkachnipi.entities.cartEntity.Cart;
import com.barkachni.barkachnipi.entities.cartEntity.ItemCart;
import com.barkachni.barkachnipi.entities.userEntity.User;
import com.barkachni.barkachnipi.services.cartService.ICartService;
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
    ICartService CartService;

    // http://localhost:8089/tpfoyer/chambre/retrieve-all-chambres
    @GetMapping("/retrieve-all-carts")
    public List<Cart> getcarts() {
        List<Cart> listcarts = CartService.retrieveAllcarts();
        return listcarts;
    }
    @GetMapping("/retrieve-all-users")
    public List<User> getusers() {
        List<User> listusers = CartService.retrieveAllusers();
        return listusers;
    }
    @GetMapping("/retrieve-all-items")
    public List<ItemCart> getitems() {
        List<ItemCart> listitems = CartService.retrieveAllitems();
        return listitems;
    }
    // http://localhost:8089/tpfoyer/cart/retrieve-cart/8
    @GetMapping("/retrieve-cart/{cart-id}")
    public Cart retrievecart(@PathVariable("cart-id") Long chId) {
        Cart cart = CartService.retrievecart(chId);
        return cart;
    }
    @PostMapping("/add-cart")
    public Cart addcart(@RequestBody Cart c) {
        Cart cart = CartService.addcart(c);
        return cart;
    }
    // http://localhost:8089/tpfoyer/cart/remove-cart/{cart-id}
    @DeleteMapping("/remove-cart/{cart-id}")
    public void removecart(@PathVariable("cart-id") Long chId) {
        CartService.removecart(chId);
    }
    // http://localhost:8089/tpfoyer/cart/modify-cart
    @PutMapping("/modify-cart")
    public Cart modifycart(@RequestBody Cart c) {
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
