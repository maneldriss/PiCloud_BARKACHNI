package com.example.pi.repositories;

import com.example.pi.entities.cart;
import com.example.pi.entities.commande;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ICommandeRepository extends JpaRepository<commande, Long> {
}
