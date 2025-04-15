package com.example.pi.controllers;

import com.example.pi.dto.PlaceOrderRequest;
import com.example.pi.entities.commande;
import com.example.pi.entities.user;
import com.example.pi.services.IServiceCommande;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@AllArgsConstructor
@RequestMapping("/commande")
public class CommandeRestController {

    @Autowired
    IServiceCommande CommandeService;

    // Endpoint to retrieve all commandes
    @GetMapping("/retrieve-all-commandes")
    public List<commande> getcommandes() {
        return CommandeService.retrieveAllcommandes();
    }

    // Endpoint to retrieve a specific commande by ID
    @GetMapping("/retrieve-commande/{commande-id}")
    public commande retrievecommande(@PathVariable("commande-id") Long commandeId) {
        return CommandeService.retrievecommande(commandeId);
    }

    // Endpoint to add a new commande
    @PostMapping("/add-commande")
    public commande addcommande(@RequestBody commande c) {
        return CommandeService.addcommande(c);
    }

    // Endpoint to remove a commande by ID
    @DeleteMapping("/remove-commande/{commande-id}")
    public void removecommande(@PathVariable("commande-id") Long commandeId) {
        CommandeService.removecommande(commandeId);
    }

    // Endpoint to modify an existing commande
    @PutMapping("/modify-commande")
    public commande modifycommande(@RequestBody commande c) {
        return CommandeService.modifycommande(c);
    }

    // Endpoint to get the total price of a specific commande by ID
    @GetMapping("/retrieve-commande-total/{commande-id}")
    public double getCommandeTotal(@PathVariable("commande-id") Long commandeId) {
        return CommandeService.getCommandeTotal(commandeId);
    }

    // Endpoint to assign a cart to a commande (e.g., when placing an order)
    @PutMapping("/assign-cart-to-commande/{commande-id}/{cart-id}")
    public commande assignCartToCommande(@PathVariable("commande-id") Long commandeId, @PathVariable("cart-id") Long cartId) {
        return CommandeService.assignCartToCommande(commandeId, cartId);
    }
    @PostMapping("/place-order/{cartId}")
    public ResponseEntity<commande> placeOrder(
            @PathVariable Long cartId,
            @RequestBody PlaceOrderRequest request) {

        // Validate discount if provided
        if (request.getDiscountApplied() != null && request.getDiscountType() != null) {
            if ("percentage".equals(request.getDiscountType()) &&
                    (request.getDiscountApplied() < 0 || request.getDiscountApplied() > 100)) {
                return ResponseEntity.badRequest().build();
            }
            if ("fixed".equals(request.getDiscountType()) && request.getDiscountApplied() < 0) {
                return ResponseEntity.badRequest().build();
            }
        }

        commande commande = CommandeService.placeOrder(
                cartId,
                request.getShippingAddress(),
                request.getShippingMethod(),
                request.getPaymentMethod(),
                request.getDiscountApplied(),
                request.getDiscountType()
        );

        return ResponseEntity.ok(commande);
    }
    @PutMapping("/{commandeId}/payment-status/{status}")
    public ResponseEntity<Void> updatePaymentStatus(
            @PathVariable Long commandeId,
            @PathVariable String status) {
        CommandeService.updatePaymentStatus(commandeId, status);
        return ResponseEntity.ok().build();
    }


}
