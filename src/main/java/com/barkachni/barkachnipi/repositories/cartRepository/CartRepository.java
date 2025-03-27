package com.barkachni.barkachnipi.repositories.cartRepository;

import com.barkachni.barkachnipi.entities.cartEntity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Long> {
}
