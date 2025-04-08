package com.barkachni.PiLezelefons.repository;

import com.barkachni.PiLezelefons.entity.Ad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdRepository extends JpaRepository<Ad, Long> {
    List<Ad> findByTitleContaining(String title);
    List<Ad> findByBrandId(Long brandId);
}