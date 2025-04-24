package com.barkachni.barkachni.repositories;

import com.barkachni.barkachni.entities.marketplaceEntity.CategoryProduct;
import com.barkachni.barkachni.entities.marketplaceEntity.GenderProduct;
import com.barkachni.barkachni.entities.marketplaceEntity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByReservationExpiryBefore(LocalDateTime now);
    List<Product> findByReservedTrue();
    List<Product> findTop5ByGenderProductAndCategoryProductAndProductIdNot(GenderProduct genderProduct, CategoryProduct categoryProduct, Long id);

    List<Product> findByProductSeller_Id(Integer sellerId);

}
