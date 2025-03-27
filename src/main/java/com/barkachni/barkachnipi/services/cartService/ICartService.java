package com.barkachni.barkachnipi.services.cartService;

import com.barkachni.barkachnipi.entities.cartEntity.Cart;
import com.barkachni.barkachnipi.entities.cartEntity.ItemCart;
import com.barkachni.barkachnipi.entities.userEntity.user;

import java.util.List;

public interface ICartService {
    List<Cart> retrieveAllcarts();
    Cart retrievecart(Long cartId);
    List<user> retrieveAllusers();
    List<ItemCart> retrieveAllitems();
    Cart addcart(Cart cart);
    void removecart(Long cartId);
    Cart modifycart(Cart cart);

    void assignUserToCart(Long cartId, Long userId);

    void addItemToCart(Long cartId, Long itemId);
    void removeItemFromCart(Long cartId, Long itemId);

}
