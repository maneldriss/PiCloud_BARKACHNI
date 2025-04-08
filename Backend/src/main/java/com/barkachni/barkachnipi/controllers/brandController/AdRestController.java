package com.barkachni.barkachnipi.controllers.brandController;

import com.barkachni.barkachnipi.entities.brandEntity.Ad;
import com.barkachni.barkachnipi.services.brandService.IAdService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Ad Management")
@RequestMapping("/ad")
public class AdRestController {
    @Autowired
    IAdService adService;

    @GetMapping("/retrieve-all-ads")
    public List<Ad> getAllAds() {
        return adService.retrieveAllAds();
    }

    @GetMapping("/retrieve-ad/{ad-id}")
    public Ad getAdById(@PathVariable("ad-id") Long adId) {
        return adService.retrieveAdById(adId);
    }

    @PostMapping("/add-ad")
    public Ad addAd(@RequestBody Ad ad) {
        return adService.addAd(ad);
    }

    @DeleteMapping("/remove-ad/{ad-id}")
    public void removeAd(@PathVariable("ad-id") Long adId) {
        adService.removeAd(adId);
    }

    @PutMapping("/modify")
    public Ad modifyAd(@RequestBody Ad ad) {
        return adService.modifyAd(ad);
    }

    @GetMapping("/find-by-title/{title}")
    public List<Ad> findAdsByTitle(@PathVariable("title") String title) {
        return adService.findAdsByTitle(title);
    }

    @GetMapping("/find-by-brand/{brand-id}")
    public List<Ad> findAdsByBrandId(@PathVariable("brand-id") Long brandId) {
        return adService.findAdsByBrandId(brandId);
    }

    @PutMapping("/increment-clicks/{ad-id}")
    public void incrementAdClicks(@PathVariable("ad-id") Long adId) {
        adService.incrementAdClicks(adId);
    }

}
