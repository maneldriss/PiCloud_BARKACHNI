package com.barkachni.barkachnipi.repositories.brandRepository;

import com.barkachni.barkachnipi.entities.brandEntity.Ad;
import com.barkachni.barkachnipi.entities.brandEntity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BrandRepository extends JpaRepository<Brand, Long>{
    Brand findBrandByName(String name);

}
