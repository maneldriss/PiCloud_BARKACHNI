package com.barkachni.barkachni.Services.brand;

import com.barkachni.barkachni.entities.brand.Ad;
import com.barkachni.barkachni.entities.brand.AdStatus;
import com.barkachni.barkachni.repository.AdRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;


@Service
public class AdServiceImpl implements IAdService {


    private final AdRepository adRepository;
    @Autowired
    public AdServiceImpl(AdRepository adRepository) {
        this.adRepository = adRepository;
    }

    @Override
    public List<Ad> retrieveAllAds() {
        return adRepository.findAll();
    }

    @Override
    public Ad retrieveAdById(Long id) {
        return adRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ad not found with id: " + id));
    }

    @Override
    public Ad addAd(Ad ad) {
        // Validate ad before saving
        if (ad == null) {
            throw new IllegalArgumentException("Ad cannot be null");
        }

        // Ensure brand is set
        if (ad.getBrand() == null) {
            throw new IllegalArgumentException("Ad must be associated with a brand");
        }

        // Ensure expiration date is in the future
        if (ad.getExpDate().before(new Date())) {
            throw new IllegalArgumentException("Ad expiration date must be in the future");
        }

        // Set initial values
        ad.setNbClicks(0);
        ad.setStatus(AdStatus.PENDING); // <-- THIS IS THE CRUCIAL LINE

        return adRepository.save(ad);
    }

    @Override
    public void removeAd(Long id) {
        adRepository.deleteById(id);
    }

    @Override
    public Ad modifyAd(Ad ad) {
        // Validate ad exists
        adRepository.findById(ad.getId())
                .orElseThrow(() -> new RuntimeException("Ad not found with id: " + ad.getId()));

        return adRepository.save(ad);
    }

    @Override
    public List<Ad> findAdsByTitle(String title) {
        return adRepository.findByTitleContaining(title);
    }

    @Override
    public List<Ad> findAdsByBrandId(Long brandId) {
        return adRepository.findByBrandId(brandId);
    }

    @Override
    public void incrementAdClicks(Long adId) {
        Ad ad = retrieveAdById(adId);
        ad.setNbClicks(ad.getNbClicks() + 1);
        adRepository.save(ad);
    }
    @Override
    public List<Ad> getPendingAds() {
        return adRepository.findByStatus(AdStatus.PENDING);
    }

    @Override
    public void approveAd(Long id) {
        Ad ad = adRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ad not found"));
        ad.setStatus(AdStatus.APPROVED);
        ad.setApprovalDate(new Date());
        adRepository.save(ad);
    }

    @Override
    @Transactional
    public void rejectAd(Long id, String reason) {
        // Simply delete the ad permanently
        adRepository.deleteById(id);

        // If you need to log the rejection first:
        /*
        Ad ad = adRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ad not found"));
        // Log rejection to external system if needed
        adRepository.delete(ad);
        */
    }
    @Override
    public List<Ad> findApprovedAdsByBrandId(Long brandId) {
        return adRepository.findByBrandIdAndStatus(brandId, AdStatus.APPROVED);
    }

}