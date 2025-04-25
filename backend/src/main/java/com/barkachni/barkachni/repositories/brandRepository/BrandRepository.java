package com.barkachni.barkachni.repositories.brandRepository;

import com.barkachni.barkachni.entities.brand.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {
    Brand findBrandByName(String name);
}