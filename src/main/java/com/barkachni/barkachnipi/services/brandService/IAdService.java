package com.barkachni.barkachnipi.services.brandService;

import com.barkachni.barkachnipi.entities.brandEntity.Ad;

import java.util.List;

public interface IAdService {
    List<Ad> retrieveAllAds();
    Ad retrieveAdById(Long adId);
    Ad addAd(Ad ad);
    void removeAd(Long adId);
    Ad modifyAd(Ad ad);
    List<Ad> findAdsByTitle(String title);
    List<Ad> findAdsByBrandId(Long brandId);
    void incrementAdClicks(Long adId);
}
