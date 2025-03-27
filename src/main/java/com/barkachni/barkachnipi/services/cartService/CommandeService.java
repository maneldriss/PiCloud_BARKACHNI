package com.barkachni.barkachnipi.services.cartService;

import com.barkachni.barkachnipi.entities.cartEntity.Commande;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.barkachni.barkachnipi.repositories.cartRepository.CommandeRepository;

import java.util.List;

@Service
@AllArgsConstructor
public class CommandeService implements ICommandeService{
    @Autowired
    CommandeRepository CommandeRepository;
    public List<Commande> retrieveAllcommandes() {
        return CommandeRepository.findAll();
    }

    public Commande retrievecommande(Long commandeId) {
        return CommandeRepository.findById(commandeId).get();
    }


    public Commande addcommande(Commande c) {
        return CommandeRepository.save(c);
    }

    public void removecommande(Long commandeId) {
        CommandeRepository.deleteById(commandeId);
    }



    public Commande modifycommande(Commande commande) {
        return CommandeRepository.save(commande);
    }

}
