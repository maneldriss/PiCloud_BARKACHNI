package com.barkachni.PiLezelefons.repository;

import com.barkachni.PiLezelefons.entity.Ad;
import com.barkachni.PiLezelefons.entity.AdStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface AdRepository extends JpaRepository<Ad, Long> {
    List<Ad> findByTitleContaining(String title);

    List<Ad> findByBrandId(Long brandId);

    List<Ad> findByStatus(AdStatus status);

    List<Ad> findByBrandIdAndStatus(Long brandId, AdStatus status);

    @Query("SELECT a FROM Ad a WHERE a.brand.id = :brandId AND a.status = 'APPROVED'")
    List<Ad> findApprovedAdsByBrandId(@Param("brandId") Long brandId);

    // Add this method to find pending ads specifically
    @Query("SELECT a FROM Ad a WHERE a.status = 'PENDING'")
    List<Ad> findPendingAds();

    @Query("SELECT a FROM Ad a WHERE a.status = 'APPROVED' AND a.expDate > :currentDate AND a.deleted = false")
    List<Ad> findApprovedActiveAds(@Param("currentDate") Date currentDate);
}