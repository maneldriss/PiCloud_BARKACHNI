package com.barkachni.barkachni.controller;

import com.barkachni.barkachni.entities.brand.Ad;
import com.barkachni.barkachni.entities.brand.Brand;
import com.barkachni.barkachni.repository.AdRepository;
import com.barkachni.barkachni.Services.brand.IBrandService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@Tag(name = "Brand Management")
@RequestMapping("/brand")
public class BrandRestController {
    private final IBrandService brandService;
    private final AdRepository adRepository; // Properly injected

    private static final String UPLOAD_DIR = "uploads/";
    private final Path uploadDir = Paths.get("uploads");

    @GetMapping("/retrieve-all-brands")
    public List<Brand> getAllBrands() {
        return brandService.retrieveAllBrands();
    }

    @GetMapping("/retrieve-brand/{brand-id}")
    public Brand getBrandById(@PathVariable("brand-id") Long brandId) {
        return brandService.retrieveBrandById(brandId);
    }

    @PostMapping("/add-brand")
    public Brand addBrand(@RequestBody Brand b) {
        return brandService.addBrand(b);
    }

    @DeleteMapping("/remove-brand/{brand-id}")
    public ResponseEntity<?> removeBrand(@PathVariable("brand-id") Long brandId) {
        try {
            // First check if brand has ads
            List<Ad> brandAds = adRepository.findByBrandId(brandId);
            if (!brandAds.isEmpty()) {
                return ResponseEntity.badRequest().body(
                        Map.of(
                                "error", "Cannot delete brand",
                                "message", "Brand has associated ads. Delete ads first.",
                                "adCount", brandAds.size()
                        )
                );
            }

            brandService.removeBrand(brandId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    Map.of("error", "Failed to delete brand", "message", e.getMessage())
            );
        }
    }

    @PutMapping("/modify")
    public Brand modifyBrand(@RequestBody Brand b) {
        return brandService.modifyBrand(b);
    }

    @GetMapping("/find-by-name/{brand-name}")
    public Brand findBrandByName(@PathVariable("brand-name") String name) {
        return brandService.findBrandByName(name);
    }

    @PostMapping("/upload-logo")
    public ResponseEntity<String> uploadLogo(@RequestParam("file") MultipartFile file) {
        try {
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = uploadDir.resolve(filename);
            Files.copy(file.getInputStream(), filePath);

            String relativePath = "/brand/logos/" + filename;
            return ResponseEntity.ok(relativePath);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload file");
        }
    }

    @GetMapping("/logos/{filename:.+}")
    public ResponseEntity<byte[]> getLogo(@PathVariable String filename) throws IOException {
        Path filePath = uploadDir.resolve(filename);
        if (!Files.exists(filePath)) {
            return ResponseEntity.notFound().build();
        }

        byte[] imageBytes = Files.readAllBytes(filePath);
        String mimeType = Files.probeContentType(filePath);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(mimeType))
                .body(imageBytes);
    }
}