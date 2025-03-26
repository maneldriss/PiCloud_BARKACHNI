package com.example.pi.services;

import com.example.pi.entities.cart;
import com.example.pi.entities.item;
import com.example.pi.entities.user;

import java.util.List;

public interface IServiceCart {  List<cart> retrieveAllcarts();
    cart retrievecart(Long cartId);
List<user> retrieveAllusers();
  List<item> retrieveAllitems();
    cart addcart(cart cart);
    void removecart(Long cartId);
    cart modifycart(cart cart);

    void assignUserToCart(Long cartId, Long userId);

    void addItemToCart(Long cartId, Long itemId);
 void removeItemFromCart(Long cartId, Long itemId);
}
