package com.barkachni.barkachni.Services.cart;


import com.barkachni.barkachni.entities.cart.cart;
import com.barkachni.barkachni.entities.cart.commande;
import com.barkachni.barkachni.entities.user.User;
import com.barkachni.barkachni.entities.user.UserRepository;
import com.barkachni.barkachni.repositories.cart.ICartRepository;
import com.barkachni.barkachni.repositories.cart.ICommandeRepository;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;

@Service
@AllArgsConstructor
public class ServiceCommande implements IServiceCommande {

    @Autowired
    private ICommandeRepository commandeRepository;

    @Autowired
    private ICartRepository cartRepository;
    @Autowired
    private UserRepository UserRepository;


    // Get all commandes
    @Override
    public List<commande> retrieveAllcommandes() {
        return commandeRepository.findAll();
    }

    // Retrieve a specific commande by ID
    @Override
    public commande retrievecommande(Long commandeId) {
        return commandeRepository.findById(commandeId)
                .orElseThrow(() -> new RuntimeException("Commande not found with ID: " + commandeId));
    }

    // Add a new commande
    @Override
    public commande addcommande(commande c) {
        // Ensure the cart is saved before adding to commande
        if (c.getCart() != null) {
            cart cart = c.getCart();
            cartRepository.save(cart); // Save the associated cart
        }
        updateCommandeTotal(c);
        return commandeRepository.save(c);
    }

    // Remove a commande by ID
    @Override
    public void removecommande(Long commandeId) {
        commandeRepository.deleteById(commandeId);
    }

    // Modify an existing commande
    @Override
    public commande modifycommande(commande c) {
        // Ensure the cart is saved before updating commande
        if (c.getCart() != null) {
            cart cart = c.getCart();
            cartRepository.save(cart); // Save the associated cart
        }
        updateCommandeTotal(c);
        return commandeRepository.save(c);
    }

    // Assign a cart to a commande (used when placing an order)
    @Override
    public commande assignCartToCommande(Long commandeId, Long cartId) {
        commande c = retrievecommande(commandeId);
        cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found with ID: " + cartId));

        c.setCart(cart);
        return commandeRepository.save(c);
    }

    public void updateCommandeTotal(commande commande) {
        commande.calculateTotal();
    }

    @Override
    // Public method to get total if needed from controller
    public double getCommandeTotal(Long commandeId) {
        commande c = retrievecommande(commandeId);
        updateCommandeTotal(c);
        return c.getTotal();
    }// Get total for a specific commande

    @Override
    @Transactional
    public commande placeOrder(Long cartId, String shippingAddress,
                               String shippingMethod, String paymentMethod,
                               Double discountApplied, String discountType,
                               Integer UserId) {
        // Step 1: Fetch the cart
        cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        // Step 2: Fetch the User
        User user = UserRepository.findById(UserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (cart.getCartitems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Step 3: Create a new Commande
        commande commande = new commande();
        commande.setUser(user);
        commande.setShippingAddress(shippingAddress);
        commande.setStatus("Pending");
        commande.setPaymentStatus("Unpaid");
        commande.setPaymentMethod(paymentMethod);
        commande.setShippingMethod(shippingMethod);
        commande.setShippingCost(10.0);

        // Set discount fields
        commande.setDiscountApplied(discountApplied);
        commande.setDiscountType(discountType);

        commande.setCommandeItems(new HashSet<>(cart.getCartitems()));
        commande.calculateTotal();

        commandeRepository.save(commande);

        cart.getCartitems().clear();
        cartRepository.save(cart); // clear cart items after placing the order

        return commande;
    }

    @Override

    public void updatePaymentStatus(Long commandeId, String status) {
        commande commande = commandeRepository.findById(commandeId)
                .orElseThrow(() -> new RuntimeException("Commande not found with ID: " + commandeId));
        commande.setPaymentStatus(status);
        commandeRepository.save(commande);
    }
}