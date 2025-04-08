package com.barkachni.barkachnipi.services.brandService;

import com.barkachni.barkachnipi.entities.brandEntity.Brand;

import java.util.List;

public interface IBrandService {
    List<Brand> retrieveAllBrands();
    Brand retrieveBrandById(Long brandId);
    Brand addBrand(Brand b);
    void removeBrand(Long brandId);
    Brand modifyBrand(Brand brand);
    Brand findBrandByName(String name);
}
