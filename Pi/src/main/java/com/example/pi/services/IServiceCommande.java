package com.example.pi.services;

import com.example.pi.entities.commande;

import java.util.List;

public interface IServiceCommande {
    List<commande> retrieveAllcommandes();
    commande retrievecommande(Long commandeId);
    commande addcommande(commande commande);
    void removecommande(Long commandeId);
    commande modifycommande(commande commande);
}
