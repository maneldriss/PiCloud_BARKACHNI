package com.example.pi.repositories;

import com.example.pi.entities.commande;
import com.example.pi.entities.user;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IUserRepository extends JpaRepository<user, Long> {
}
