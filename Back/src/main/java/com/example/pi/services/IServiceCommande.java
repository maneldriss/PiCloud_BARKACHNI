package com.example.pi.services;

import com.example.pi.entities.commande;

import java.util.List;

public interface IServiceCommande {
    List<commande> retrieveAllcommandes();
    commande retrievecommande(Long commandeId);
    commande addcommande(commande commande);
    void removecommande(Long commandeId);
    commande modifycommande(commande commande);
    commande assignCartToCommande(Long commandeId, Long cartId);
    public double getCommandeTotal(Long commandeId);


    commande placeOrder(Long cartId, String shippingAddress, String shippingMethod, String paymentMethod);
}
