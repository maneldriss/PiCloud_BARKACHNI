package com.example.pi.repositories;

import com.example.pi.entities.cart;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ICartRepository extends JpaRepository<cart, Long> {
}
