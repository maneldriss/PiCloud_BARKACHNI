package com.barkachni.barkachni.repositories.cart;


import com.barkachni.barkachni.entities.cart.Cartitem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IitemRepository extends JpaRepository<Cartitem, Long> {
}
