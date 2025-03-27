package com.barkachni.barkachnipi.repositories.brandRepository;

import com.barkachni.barkachnipi.entities.brandEntity.Ad;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdRepository extends JpaRepository<Ad, Long> {
    List<Ad> findByTitleContaining(String title);
    List<Ad> findByBrandId(Long brandId);
}
