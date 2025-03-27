package com.barkachni.barkachnipi.services.brandService;

import com.barkachni.barkachnipi.entities.brandEntity.Ad;
import com.barkachni.barkachnipi.repositories.brandRepository.AdRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@RequiredArgsConstructor
@AllArgsConstructor
@Service
public class AdService implements IAdService {
    @Autowired
    private AdRepository adRepository;

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

        // Set initial click count to 0
        ad.setNbClicks(0);

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

}
