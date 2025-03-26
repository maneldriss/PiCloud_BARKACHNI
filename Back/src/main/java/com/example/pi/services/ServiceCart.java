package com.example.pi.services;

import com.example.pi.entities.cart;
import com.example.pi.entities.item;
import com.example.pi.entities.user;
import com.example.pi.repositories.ICartRepository;
import com.example.pi.repositories.IUserRepository;
import com.example.pi.repositories.IitemRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ServiceCart implements IServiceCart {
    @Autowired
    ICartRepository CartRepository;
    @Autowired
    IUserRepository UserRepository; @Autowired
    private IitemRepository itemRepository;


    public List<cart> retrieveAllcarts() {
        return CartRepository.findAll();
    }
    public List<user> retrieveAllusers() {
        return UserRepository.findAll();
    }
    public List<item> retrieveAllitems() {
        return itemRepository.findAll();
    }
    public cart retrievecart(Long cartId) {
        return CartRepository.findById(cartId).get();
    }

    public cart addcart(cart c) {
        return CartRepository.save(c);
    }

    public void removecart(Long cartId) {
        CartRepository.deleteById(cartId);
    }



    public cart modifycart(cart cart) {
        return CartRepository.save(cart);
    }
    @Override
    public void assignUserToCart(Long cartId, Long userId) {
        // Fetch the User entity by ID
        user user = UserRepository.findById(userId).get();

        // Fetch the Cart entity by ID
      cart cart = CartRepository.findById(cartId).get();

        // Assign the User to the Cart
        cart.setUser(user);

        // Save the updated Cart to the database
        CartRepository.save(cart);

    }
    @Override
    public void addItemToCart(Long cartId, Long itemId) {
        // Fetch the cart from the repository
        cart cart = CartRepository.findById(cartId).get();

        // Fetch the item from the repository
       item item = itemRepository.findById(itemId).get();

        // Add the item to the cart
        cart.getItems().add(item); // Adding item to the set of items

        // Save the updated cart back to the repository
        CartRepository.save(cart);
    }
    @Override
    public void removeItemFromCart(Long cartId, Long itemId) {
        // Fetch the cart from the repository
        cart cart = CartRepository.findById(cartId).orElseThrow(() ->
                new RuntimeException("Cart not found with id: " + cartId));

        // Fetch the item from the repository
        item item = itemRepository.findById(itemId).orElseThrow(() ->
                new RuntimeException("Item not found with id: " + itemId));

        // Remove the item from the cart
        if (cart.getItems().remove(item)) {
            // Save the updated cart back to the repository
            CartRepository.save(cart);
        } else {
            throw new RuntimeException("Item not found in the cart.");
        }
    }


}
