package com.barkachni.barkachnipi.services.brandService;

import com.barkachni.barkachnipi.entities.brandEntity.Brand;
import com.barkachni.barkachnipi.repositories.brandRepository.BrandRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@AllArgsConstructor
@Service
public class BrandService implements IBrandService{
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

}
