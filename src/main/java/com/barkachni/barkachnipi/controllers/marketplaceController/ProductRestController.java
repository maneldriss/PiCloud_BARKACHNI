package com.barkachni.barkachnipi.controllers.marketplaceController;

import com.barkachni.barkachnipi.entities.marketplaceEntity.Product;
import com.barkachni.barkachnipi.services.marketplaceService.IProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Tag(name="Gestion MarketPlace")
@RestController
@AllArgsConstructor
@RequestMapping("/marketplace")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductRestController {
    @Autowired
    IProductService productService;
    // http://localhost:8089/PICloud/marketplace/retrieve-all-products
    @Operation(description = "récupérer toutes les products de la base de données")
    @GetMapping("/retrieve-all-products")
    public List<Product> getProducts() {
        List<Product> listProducts = productService.retrieveAllProducts();
        return listProducts;
    }

    // http://localhost:8089/PICloud/product/retrieve-product/8
    @GetMapping("/retrieve-product/{productId}")
    public Product retrieveProduct(@PathVariable("productId") long productId) {
        System.out.println("Product ID in service layer: " + productId); // Debugging line
        Product product = productService.retrieveProduct(productId);
        return product;
    }
    // ttp://localhost:8089/PICloud/product/add-product
    @PostMapping("/add-product")
    public Product addProduct(@RequestBody Product p) {
        Product product = productService.addProduct(p);
        return product;
    }
    // ttp://localhost:8089/PICloud/product/remove-product/{productId}
    @DeleteMapping("/remove-product/{productId}")
    public void removeProduct(@PathVariable("productId") long productId) {
        productService.removeProduct(productId);

    }


    @PutMapping("/modify-product/{productId}")
    public Product modifyProduct(@RequestBody Product p, @PathVariable Long productId) {
        p.setProductId(productId); // or whatever your ID field is
        return productService.modifyProduct(p);
    }
//image upload
    @PostMapping("/upload-image")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String uploadDirBackend = "uploads/";  // For backend storage
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePathBackend = Paths.get(uploadDirBackend + fileName);

            // Create folder if not exists
            Files.createDirectories(filePathBackend.getParent());

            // Save file to backend directory
            Files.write(filePathBackend, file.getBytes());

            // Now return the filename in a JSON response
            return ResponseEntity.ok(Map.of("fileName", fileName));  // Return filename
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload");
        }
    }

    //reservation purposes
    @PostMapping("/products/{id}/reserve")
    public ResponseEntity<Product> reserveProduct(@PathVariable Long id, @RequestParam Long userId) {
        Product reservedProduct = productService.reserveProduct(id, userId);
        return ResponseEntity.ok(reservedProduct);
    }

    @GetMapping("/reserved-products")
    public List<Product> getReservedProducts() {
        return productService.getReservedProducts();  // Get reserved products
    }

    @DeleteMapping("/unreserve-product/{productId}")
    public ResponseEntity<String> unreserveProduct(@PathVariable Long productId) {
        boolean isUnreserved = productService.unreserveProduct(productId);
        return ResponseEntity.noContent().build();
    }

}




