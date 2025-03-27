package com.barkachni.barkachnipi.repositories.marketplaceRepository;

import com.barkachni.barkachnipi.entities.marketplaceEntity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
