package com.barkachni.barkachni.Services.cart;


import com.barkachni.barkachni.entities.cart.Cartitem;
import com.barkachni.barkachni.entities.cart.cart;
import com.barkachni.barkachni.entities.marketplaceEntity.Product;
import com.barkachni.barkachni.entities.user.User;
import com.barkachni.barkachni.entities.user.UserRepository;
import com.barkachni.barkachni.repository.ProductRepository;
import com.barkachni.barkachni.repository.cart.ICartRepository;
import com.barkachni.barkachni.repository.cart.IitemRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ServiceCart implements IServiceCart {

    @Autowired
    private ICartRepository cartRepository;

    @Autowired
    private UserRepository UserRepository;

    @Autowired
    private IitemRepository itemRepository;

    @Autowired
    private ProductRepository productRepository;

    // Get all carts
    public List<cart> retrieveAllcarts() {
        return cartRepository.findAll();
    }

    public List<User> retrieveAllUsers() {
        return UserRepository.findAll();
    }

    public List<Cartitem> retrieveAllitems() {
        return itemRepository.findAll();
    }

    public cart retrievecart(Long cartId) {
        return cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found with ID: " + cartId));
    }

    @Override
    public List<User> retrieveAllusers() {
        return null;
    }

    public cart addcart(cart c) {
        return cartRepository.save(c);
    }

    public void removecart(Long cartId) {
        cartRepository.deleteById(cartId);
    }

    public cart modifycart(cart c) {
        return cartRepository.save(c);
    }

    // Assign a User to a cart
    @Override
    public void assignUserToCart(Long cartId, Integer UserId) {
        User User = UserRepository.findById(UserId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + UserId));
        cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found with ID: " + cartId));
        cart.setUser(User);
        cartRepository.save(cart);
    }

    // Add an item (existing) to the cart
    @Override
    public void addItemToCart(Long cartId, Long itemId) {
        cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found with ID: " + cartId));
        Cartitem cartItem = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found with ID: " + itemId));
        cart.getCartitems().add(cartItem);
        updateCartTotal(cart);
        cartRepository.save(cart);
    }
    @Override
    // Add a product to cart (create Cartitem on the fly)
    public void addProductToCart(Long cartId, Long productId, int quantity) {
        cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found with ID: " + cartId));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + productId));

        Cartitem item = new Cartitem();
        item.setProduct(product);
        item.setQuantity(quantity);
        item.setName(product.getNameProduct());

        itemRepository.save(item);
        cart.getCartitems().add(item);
        updateCartTotal(cart);
        cartRepository.save(cart);
    }
    @Override
    // Update quantity of a Cartitem
    public void updateItemQuantity(Long cartId, Long itemId, int quantity) {
        cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found with ID: " + cartId));
        Optional<Cartitem> optionalItem = cart.getCartitems().stream()
                .filter(i -> i.getItemID().equals(itemId))
                .findFirst();
        if (optionalItem.isPresent()) {
            Cartitem item = optionalItem.get();
            item.setQuantity(quantity);
            itemRepository.save(item);
            updateCartTotal(cart);
            cartRepository.save(cart);
        } else {
            throw new RuntimeException("Item not found in cart");
        }
    }

    // Remove an item from the cart
    @Override
    public void removeItemFromCart(Long cartId, Long itemId) {
        cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found with ID: " + cartId));
        Cartitem item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found with ID: " + itemId));
        if (cart.getCartitems().remove(item)) {
            itemRepository.delete(item);
            updateCartTotal(cart);
            cartRepository.save(cart);
        } else {
            throw new RuntimeException("Item not part of the cart");
        }
    }

    // Compute total of the cart
    public void updateCartTotal(cart cart) {
        double total = cart.getCartitems().stream()
                .mapToDouble(item -> item.getProduct().getProductPrice() * item.getQuantity())
                .sum();
        cart.setTotal(total);
    }
    @Override
    // Public method to get total if needed from controller
    public double getCartTotal(Long cartId) {
        cart c = retrievecart(cartId);
        updateCartTotal(c);
        return c.getTotal();
    }
    @Override
    public cart retrieveCartByUserId(Integer userId) {
        // Fetch the User by ID
        User user = UserRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        // Retrieve all carts and filter for the one associated with the User
        return cartRepository.findAll().stream()
                .filter(cart -> cart.getUser() != null && cart.getUser().getId().equals(userId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No cart found for User with ID: " + userId));
    }

}
