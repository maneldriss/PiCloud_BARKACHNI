package com.barkachni.barkachni.Services.brand;

import com.barkachni.barkachni.entities.brand.Brand;
import com.barkachni.barkachni.repository.BrandRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@AllArgsConstructor
@Service
public class BrandServiceImpl implements IBrandService {
    private static final String UPLOAD_DIR = "uploads/";
    @Autowired
    private BrandRepository brandRepository;
    @Override
    public List<Brand> retrieveAllBrands() {
        return brandRepository.findAll();
    }
    @Override
    public Brand retrieveBrandById(Long id) {
        return brandRepository.findById(id).get();
    }
    @Override
    public Brand addBrand(Brand b) {
        return brandRepository.save(b);
    }
    @Override
    public void removeBrand(Long id) {
        brandRepository.deleteById(id);
    }
    @Override
    public Brand modifyBrand(Brand brand) {
        return brandRepository.save(brand);
    }
    @Override
    public Brand findBrandByName(String name) {
        return brandRepository.findBrandByName(name);
    }
    @Override
    public String uploadLogo(MultipartFile file) {
        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(filename);

            // Save file
            Files.copy(file.getInputStream(), filePath);

            // Return the URL to access the file
            return "/brand/logos/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }
}