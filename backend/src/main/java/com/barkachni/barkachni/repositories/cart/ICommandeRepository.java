package com.barkachni.barkachni.repositories.cart;


import com.barkachni.barkachni.entities.cart.commande;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ICommandeRepository extends JpaRepository<commande, Long> {
}
