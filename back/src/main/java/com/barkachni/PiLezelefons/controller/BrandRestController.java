package com.barkachni.PiLezelefons.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.barkachni.PiLezelefons.entity.Brand;
import com.barkachni.PiLezelefons.service.IBrandService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@Tag(name = "Brand Management")
@RequestMapping("/brand")
public class BrandRestController {
    @Autowired
    private final IBrandService brandService;
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
    public void removeBrand(@PathVariable("brand-id") Long brandId) {
        brandService.removeBrand(brandId);
    }

    @PutMapping("/modify")
    public Brand modifyBrand(@RequestBody Brand b) {
        return brandService.modifyBrand(b);
    }

    @GetMapping("/find-by-name/{brand-name}")
    public Brand findBrandByName(@PathVariable("brand-name")
                                     String name) {
        return brandService.findBrandByName(name);
    }
    @PostMapping("/upload-logo")
    public ResponseEntity<String> uploadLogo(@RequestParam("file") MultipartFile file) {
        try {
            // Create directory if needed
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            // Generate unique filename
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = uploadDir.resolve(filename);

            // Save file
            Files.copy(file.getInputStream(), filePath);

            // Return the relative path
            String relativePath = "/brand/logos/" + filename;
            return ResponseEntity.ok(relativePath);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload file");
        }
    }

    // Add this to serve the uploaded files
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