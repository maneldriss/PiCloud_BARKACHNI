package com.barkachni.barkachni.repositories.cart;


import com.barkachni.barkachni.entities.cart.cart;
import com.barkachni.barkachni.entities.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ICartRepository extends JpaRepository<cart, Long> {
    Optional<cart> findByUser_Id(Integer userId);
}
