package com.barkachni.PiLezelefons.service;

import com.barkachni.PiLezelefons.entity.Brand;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IBrandService {
    List<Brand> retrieveAllBrands();
    Brand retrieveBrandById(Long brandId);
    Brand addBrand(Brand b);
    void removeBrand(Long brandId);
    Brand modifyBrand(Brand brand);
    Brand findBrandByName(String name);
    String uploadLogo(MultipartFile file); // Add this method

}