package com.barkachni.PiLezelefons.controller;

import com.barkachni.PiLezelefons.entity.AdStatus;
import com.barkachni.PiLezelefons.repository.AdRepository;
import com.barkachni.PiLezelefons.service.FileStorageService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.barkachni.PiLezelefons.entity.Ad;
import com.barkachni.PiLezelefons.service.IAdService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@Tag(name = "Ad Management")
@RequestMapping("/ad")
public class AdRestController {
    private final IAdService adService;
    private final AdRepository adRepository;
    private final FileStorageService fileStorageService;
    @Autowired
    public AdRestController(IAdService adService,
                            AdRepository adRepository, // Add this
                            FileStorageService fileStorageService) {
        this.adService = adService;
        this.adRepository = adRepository; // Add this

        this.fileStorageService = fileStorageService;
    }
    @GetMapping("/retrieve-all-ads")
    public List<Ad> getAllAds() {
        return adService.retrieveAllAds();
    }

    @GetMapping("/retrieve-ad/{ad-id}")
    public Ad getAdById(@PathVariable("ad-id") Long adId) {
        return adService.retrieveAdById(adId);
    }

    @PostMapping("/add-ad")
    public ResponseEntity<?> addAd(@RequestBody Ad ad) {
        try {
            Ad savedAd = adService.addAd(ad);
            return ResponseEntity.ok(savedAd);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "error", "Validation failed",
                            "message", e.getMessage(),
                            "timestamp", new Date()
                    )
            );
        }
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
    @PostMapping("/upload-image")
    public ResponseEntity<String> uploadAdImage(@RequestParam("file") MultipartFile file) {
        try {
            String fileName = fileStorageService.storeFile(file);
            return ResponseEntity.ok("/ad/images/" + fileName);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to upload image");
        }
    }

    @GetMapping("/images/{fileName:.+}")
    public ResponseEntity<byte[]> getAdImage(@PathVariable String fileName) {
        try {
            byte[] imageBytes = fileStorageService.loadFile(fileName);
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG) // or detect type
                    .body(imageBytes);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/pending")
    public List<Ad> getPendingAds() {
        return adService.getPendingAds();
    }

    // In your approve endpoint
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveAd(@PathVariable Long id) {
        Ad ad = adRepository.findById(id).orElseThrow();
        System.out.println("Before approval - Status: " + ad.getStatus()); // Debug log

        ad.setStatus(AdStatus.APPROVED);
        ad.setApprovalDate(new Date());
        adRepository.save(ad);

        System.out.println("After approval - Status: " + ad.getStatus()); // Debug log
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectAd(@PathVariable Long id) {
        try {
            adService.rejectAd(id, ""); // Reason no longer needed
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to delete ad");
        }
    }
    @GetMapping("/brand/{brandId}")
    public ResponseEntity<List<Ad>> getAdsByBrand(
            @PathVariable Long brandId,
            @RequestParam(required = false) AdStatus status) {

        if (status != null) {
            return ResponseEntity.ok(adRepository.findByBrandIdAndStatus(brandId, status));
        }
        return ResponseEntity.ok(adRepository.findByBrandId(brandId));
    }

    @GetMapping("/approved-for-homepage")
    public List<Ad> getApprovedAdsForHomepage() {
        return adRepository.findApprovedActiveAds(new Date());
    }
}