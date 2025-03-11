package com.example.pi.controllers;

import com.example.pi.entities.commande;

import com.example.pi.services.IServiceCommande;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/commande")
public class CommandeRestController {
    @Autowired
    IServiceCommande CommandeService;
    // http://localhost:8089/tpfoyer/chambre/retrieve-all-chambres
    @GetMapping("/retrieve-all-commandes")
    public List<commande> getcommandes() {
        List<commande> listcommandes =  CommandeService.retrieveAllcommandes();
        return listcommandes;
    }
    // http://localhost:8089/tpfoyer/commande/retrieve-commande/8
    @GetMapping("/retrieve-commande/{commande-id}")
    public commande retrievecommande(@PathVariable("commande-id") Long chId) {
        commande commande =  CommandeService.retrievecommande(chId);
        return commande;
    }
    @PostMapping("/add-commande")
    public commande addcommande(@RequestBody commande c) {
        commande commande =  CommandeService.addcommande(c);
        return commande;
    }
    // http://localhost:8089/tpfoyer/commande/remove-commande/{commande-id}
    @DeleteMapping("/remove-commande/{commande-id}")
    public void removecommande(@PathVariable("commande-id") Long chId) {
         CommandeService.removecommande(chId);
    }
    // http://localhost:8089/tpfoyer/commande/modify-commande
    @PutMapping("/modify-commande")
    public commande modifycommande(@RequestBody commande c) {
        return   CommandeService.modifycommande(c);

    }

}
