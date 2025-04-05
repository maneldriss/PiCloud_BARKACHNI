package com.example.pi.services;

import com.example.pi.entities.commande;
import com.example.pi.entities.cart;
import com.example.pi.repositories.ICommandeRepository;
import com.example.pi.repositories.ICartRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ServiceCommande implements IServiceCommande {

    @Autowired
    private ICommandeRepository commandeRepository;

    @Autowired
    private ICartRepository cartRepository;

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

    // Get total for a specific commande
    @Override
    public double getCommandeTotal(Long commandeId) {
        commande c = retrievecommande(commandeId);
        cart cart = c.getCart();
        if (cart != null) {
            return cart.getTotal(); // Fetch the total from the associated cart
        }
        throw new RuntimeException("Commande has no cart associated with it");
    }
}
