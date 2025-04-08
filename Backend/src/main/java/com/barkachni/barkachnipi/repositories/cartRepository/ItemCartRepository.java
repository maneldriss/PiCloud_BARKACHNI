package com.barkachni.barkachnipi.repositories.cartRepository;

import com.barkachni.barkachnipi.entities.cartEntity.ItemCart;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemCartRepository extends JpaRepository<ItemCart, Long> {
}
