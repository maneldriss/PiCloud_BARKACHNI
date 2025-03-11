package com.example.pi.services;

import com.example.pi.entities.commande;
import com.example.pi.repositories.ICartRepository;
import com.example.pi.repositories.ICommandeRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ServiceCommande implements IServiceCommande{
    @Autowired
    ICommandeRepository CommandeRepository;
    public List<commande> retrieveAllcommandes() {
        return CommandeRepository.findAll();
    }

    public commande retrievecommande(Long commandeId) {
        return CommandeRepository.findById(commandeId).get();
    }


    public commande addcommande(commande c) {
        return CommandeRepository.save(c);
    }

    public void removecommande(Long commandeId) {
        CommandeRepository.deleteById(commandeId);
    }



    public commande modifycommande(commande commande) {
        return CommandeRepository.save(commande);
    }

}
