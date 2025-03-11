package com.example.pi.repositories;

import com.example.pi.entities.commande;
import com.example.pi.entities.item;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IitemRepository extends JpaRepository<item, Long> {
}
