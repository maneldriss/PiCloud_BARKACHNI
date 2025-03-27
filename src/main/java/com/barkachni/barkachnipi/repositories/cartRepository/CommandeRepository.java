package com.barkachni.barkachnipi.repositories.cartRepository;

import com.barkachni.barkachnipi.entities.cartEntity.Commande;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommandeRepository extends JpaRepository<Commande, Long> {
}
