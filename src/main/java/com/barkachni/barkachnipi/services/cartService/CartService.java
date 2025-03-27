package com.barkachni.barkachnipi.services.cartService;

import com.barkachni.barkachnipi.entities.cartEntity.Cart;
import com.barkachni.barkachnipi.entities.cartEntity.ItemCart;
import com.barkachni.barkachnipi.entities.userEntity.user;
import com.barkachni.barkachnipi.repositories.cartRepository.ItemCartRepository;
import com.barkachni.barkachnipi.repositories.userRepository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class CartService implements ICartService {
    @Autowired
    com.barkachni.barkachnipi.repositories.cartRepository.CartRepository CartRepository;
    @Autowired
    UserRepository UserRepository;
    @Autowired
    private ItemCartRepository itemRepository;


    public List<Cart> retrieveAllcarts() {
        return CartRepository.findAll();
    }
    public List<user> retrieveAllusers() {
        return UserRepository.findAll();
    }
    public List<ItemCart> retrieveAllitems() {
        return itemRepository.findAll();
    }
    public Cart retrievecart(Long cartId) {
        return CartRepository.findById(cartId).get();
    }

    public Cart addcart(Cart c) {
        return CartRepository.save(c);
    }

    public void removecart(Long cartId) {
        CartRepository.deleteById(cartId);
    }



    public Cart modifycart(Cart cart) {
        return CartRepository.save(cart);
    }
    @Override
    public void assignUserToCart(Long cartId, Long userId) {
        // Fetch the User entity by ID
        user user = UserRepository.findById(userId).get();

        // Fetch the Cart entity by ID
        Cart cart = CartRepository.findById(cartId).get();

        // Assign the User to the Cart
        cart.setUser(user);

        // Save the updated Cart to the database
        CartRepository.save(cart);

    }
    @Override
    public void addItemToCart(Long cartId, Long itemId) {
        // Fetch the cart from the repository
        Cart cart = CartRepository.findById(cartId).get();

        // Fetch the item from the repository
        ItemCart itemCart = itemRepository.findById(itemId).get();

        // Add the item to the cart
        cart.getItemCarts().add(itemCart); // Adding item to the set of items

        // Save the updated cart back to the repository
        CartRepository.save(cart);
    }
    @Override
    public void removeItemFromCart(Long cartId, Long itemId) {
        // Fetch the cart from the repository
        Cart cart = CartRepository.findById(cartId).orElseThrow(() ->
                new RuntimeException("Cart not found with id: " + cartId));

        // Fetch the item from the repository
        ItemCart itemCart = itemRepository.findById(itemId).orElseThrow(() ->
                new RuntimeException("Item not found with id: " + itemId));

        // Remove the item from the cart
        if (cart.getItemCarts().remove(itemCart)) {
            // Save the updated cart back to the repository
            CartRepository.save(cart);
        } else {
            throw new RuntimeException("Item not found in the cart.");
        }
    }


}
