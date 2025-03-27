package com.barkachni.barkachnipi.controllers.cartController;

import com.barkachni.barkachnipi.entities.cartEntity.Commande;
import com.barkachni.barkachnipi.services.cartService.ICommandeService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/commande")
public class CommandeRestController {
    @Autowired
    ICommandeService CommandeService;
    // http://localhost:8089/tpfoyer/chambre/retrieve-all-chambres
    @GetMapping("/retrieve-all-commandes")
    public List<Commande> getcommandes() {
        List<Commande> listcommandes =  CommandeService.retrieveAllcommandes();
        return listcommandes;
    }
    // http://localhost:8089/tpfoyer/commande/retrieve-commande/8
    @GetMapping("/retrieve-commande/{commande-id}")
    public Commande retrievecommande(@PathVariable("commande-id") Long chId) {
        Commande commande =  CommandeService.retrievecommande(chId);
        return commande;
    }
    @PostMapping("/add-commande")
    public Commande addcommande(@RequestBody Commande c) {
        Commande commande =  CommandeService.addcommande(c);
        return commande;
    }
    // http://localhost:8089/tpfoyer/commande/remove-commande/{commande-id}
    @DeleteMapping("/remove-commande/{commande-id}")
    public void removecommande(@PathVariable("commande-id") Long chId) {
        CommandeService.removecommande(chId);
    }
    // http://localhost:8089/tpfoyer/commande/modify-commande
    @PutMapping("/modify-commande")
    public Commande modifycommande(@RequestBody Commande c) {
        return   CommandeService.modifycommande(c);

    }

}
