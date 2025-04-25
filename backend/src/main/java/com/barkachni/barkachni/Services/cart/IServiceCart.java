package com.barkachni.barkachni.Services.cart;


import com.barkachni.barkachni.entities.cart.Cartitem;
import com.barkachni.barkachni.entities.cart.cart;
import com.barkachni.barkachni.entities.user.User;

import java.util.List;

public interface IServiceCart {  List<cart> retrieveAllcarts();
    cart retrievecart(Long cartId);
List<User> retrieveAllusers();
  List<Cartitem> retrieveAllitems();
    cart addcart(cart cart);
    void removecart(Long cartId);
    cart modifycart(cart cart);


    // Assign a User to a cart
    void assignUserToCart(Long cartId, Integer UserId);

    void addItemToCart(Long cartId, Long itemId);
 void removeItemFromCart(Long cartId, Long itemId);
 void updateItemQuantity(Long cartId, Long itemId, int quantity);
    void addProductToCart(Long cartId, Long productId, int quantity);
    double getCartTotal(Long cartId);




    cart retrieveCartByUserId(Integer userId);

    cart getCartByUserId(Integer userId);
}
