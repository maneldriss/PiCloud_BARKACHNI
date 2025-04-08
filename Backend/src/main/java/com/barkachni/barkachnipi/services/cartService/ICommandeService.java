package com.barkachni.barkachnipi.services.cartService;

import com.barkachni.barkachnipi.entities.cartEntity.Commande;

import java.util.List;

public interface ICommandeService {
    List<Commande> retrieveAllcommandes();
    Commande retrievecommande(Long commandeId);
    Commande addcommande(Commande commande);
    void removecommande(Long commandeId);
    Commande modifycommande(Commande commande);

}
