package com.barkachni.PiLezelefons.repository;

import com.barkachni.PiLezelefons.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {
    Brand findBrandByName(String name);
}