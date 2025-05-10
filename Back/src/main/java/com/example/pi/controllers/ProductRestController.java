package com.example.pi.controllers;

import com.example.pi.entities.Product;
import com.example.pi.services.ProductService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/product")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class ProductRestController {
    @Autowired
ProductService productService;

    // GET all products
    @GetMapping("/retrieve-all-products")
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    // GET product by ID
    @GetMapping("/retrieve-product/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }
}
