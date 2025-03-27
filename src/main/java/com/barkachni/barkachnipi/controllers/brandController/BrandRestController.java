package com.barkachni.barkachnipi.controllers.brandController;

import com.barkachni.barkachnipi.entities.brandEntity.Brand;
import com.barkachni.barkachnipi.services.brandService.IBrandService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Brand Management")
@RequestMapping("/brand")
public class BrandRestController {
    @Autowired
    IBrandService brandService;

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

}
