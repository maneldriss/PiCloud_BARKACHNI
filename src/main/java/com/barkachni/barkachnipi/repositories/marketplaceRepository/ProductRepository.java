package com.barkachni.barkachnipi.repositories.marketplaceRepository;

import com.barkachni.barkachnipi.entities.marketplaceEntity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByReservationExpiryBefore(LocalDateTime now);
    List<Product> findByReservedTrue();

}
