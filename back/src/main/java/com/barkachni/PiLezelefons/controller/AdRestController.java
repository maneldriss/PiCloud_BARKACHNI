package com.barkachni.PiLezelefons.controller;

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
import java.util.List;

@RestController
@Tag(name = "Ad Management")
@RequestMapping("/ad")
public class AdRestController {
    @Autowired
    private final IAdService adService;
    private final FileStorageService fileStorageService;

    public AdRestController(IAdService adService, FileStorageService fileStorageService) {
        this.adService = adService;
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
}