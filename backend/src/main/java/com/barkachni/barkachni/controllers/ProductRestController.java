package com.barkachni.barkachni.controllers;


import com.barkachni.barkachni.Services.marketplaceService.IProductService;
import com.barkachni.barkachni.entities.marketplaceEntity.*;
import com.barkachni.barkachni.entities.user.User;
import com.barkachni.barkachni.repositories.ProductRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.barkachni.barkachni.Services.marketplaceService.PythonImageTaggingClient;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.util.*;

@Tag(name="Gestion MarketPlace")
@RestController
@AllArgsConstructor
@RequestMapping("/marketplace")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductRestController {
    @Autowired
    IProductService productService;
    @Autowired
    private PythonImageTaggingClient pythonTaggingClient;
    @Autowired
    ProductRepository productRepository;


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
    public ResponseEntity<?> addProduct(
            @RequestBody Product p,
            @AuthenticationPrincipal User currentUser) {

        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }

        try {
            Product savedProduct = productService.addProduct(p, currentUser.getId());
            return ResponseEntity.ok(savedProduct);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding product");
        }
    }
    // ttp://localhost:8089/PICloud/product/remove-product/{productId}
    @DeleteMapping("/remove-product/{productId}")
    public ResponseEntity<?> removeProduct(@PathVariable long productId) {
        try {
            productService.removeProduct(productId);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Deletion failed: " + e.getMessage());
        }
    }


    @PutMapping("/modify-product/{productId}")
    public Product modifyProduct(@RequestBody Product p, @PathVariable Long productId) {
        p.setProductId(productId); // or whatever your ID field is
        return productService.modifyProduct(p);
    }


    //reservation purposes
    @PostMapping("/products/{id}/reserve")
    @PreAuthorize("hasRole('USER')")  // Requires authentication
    public ResponseEntity<Product> reserveProduct(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {  // Get user from security context

        Product reservedProduct = productService.reserveProduct(id,currentUser);
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

    //recommendation purporses
    @GetMapping("/recommend")
    public List<Product> recommendProducts(@RequestParam String genderProduct, @RequestParam String categoryProduct, @RequestParam Long productId) {
        GenderProduct genderEnum = GenderProduct.valueOf(genderProduct.toUpperCase());
        CategoryProduct categoryEnum = CategoryProduct.valueOf(categoryProduct.toUpperCase());

        return productRepository.findTop5ByGenderProductAndCategoryProductAndProductIdNot(genderEnum, categoryEnum, productId);
    }


    //fazet category w picture
    private CategoryProduct mapToCategory(String aiOutput) {
        String lowerOutput = aiOutput.toLowerCase();

        if (lowerOutput.contains("pants") || lowerOutput.contains("jeans") || lowerOutput.contains("trousers"))
            return CategoryProduct.PANTS;
        else if (lowerOutput.contains("shirt") || lowerOutput.contains("t-shirt") || lowerOutput.contains("blouse"))
            return CategoryProduct.TOP;
        else if (lowerOutput.contains("jacket") || lowerOutput.contains("coat") || lowerOutput.contains("suit"))
            return CategoryProduct.JACKET;
        else if (lowerOutput.contains("dress"))
            return CategoryProduct.DRESS;
        else if (lowerOutput.contains("skirt"))
            return CategoryProduct.SKIRT;
        else if (lowerOutput.contains("bag") || lowerOutput.contains("backpack"))
            return CategoryProduct.BAG;
        else if (lowerOutput.contains("shoe") || lowerOutput.contains("sneaker") || lowerOutput.contains("boot"))
            return CategoryProduct.SHOES;
        else
            return CategoryProduct.ACCESSORIES; // Fallback for hats, jewelry, etc.
    }

    @PostMapping("/upload-with-autotag")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> uploadWithAutoTag(
            @RequestPart("file") MultipartFile file,
            @RequestPart("nameProduct") String nameProduct,
            @RequestPart("genderProduct") String genderProduct, // Changed to String
            @RequestPart("productPrice") String productPrice, // Changed to String
            @RequestPart("productDescription") String productDescription,
            @RequestPart("productSize") String productSize, // Changed to String
            @AuthenticationPrincipal User currentUser) {

        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }

        try {
            // Convert string parameters to enums
            GenderProduct genderProductEnum = GenderProduct.valueOf(genderProduct);
            ProductSize productSizeEnum = ProductSize.valueOf(productSize);
            float price = Float.parseFloat(productPrice);

            // Rest of your implementation...
            String aiCategory = pythonTaggingClient.predictCategory(file);
            CategoryProduct category = mapToCategory(aiCategory);

            String fileName = saveUploadedImage(file);
            String imageUrl = "http://localhost:8088/barkachni/uploads/" + fileName;

            Product product = new Product();
            product.setNameProduct(nameProduct);
            product.setCategoryProduct(category);
            product.setGenderProduct(genderProductEnum);
            product.setProductPrice(price);
            product.setProductDescription(productDescription);
            product.setProductSize(productSizeEnum);
            product.setProductImageURL(imageUrl);
            product.setProductSeller(currentUser);
            product.setProductState(ProductState.AVAILABLE); // Set state here
            product.setDateProductAdded(new Date());

            Product savedProduct = productService.addProduct(product, currentUser.getId());
            return ResponseEntity.ok(savedProduct);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing product: " + e.getMessage());
        }
    }
    private String saveUploadedImage(MultipartFile file) throws IOException {
        String uploadDir = "uploads/";
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir + fileName);
        Files.createDirectories(filePath.getParent());
        Files.write(filePath, file.getBytes());
        return fileName;
    }

    @GetMapping("/retrieve-my-products")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<Product>> getCurrentUserProducts(@AuthenticationPrincipal User currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<Product> products = productService.retrieveProductsBySellerId(currentUser.getId());
        return ResponseEntity.ok(products);
    }

    @PostMapping("/update-with-autotag/{productId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> updateWithAutoTag(
            @PathVariable Long productId,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestPart("nameProduct") String nameProduct,
            @RequestPart("genderProduct") String genderProduct,
            @RequestPart("productPrice") String productPrice,
            @RequestPart("productDescription") String productDescription,
            @RequestPart("productSize") String productSize,
            @RequestPart("productState") String productState,
            @AuthenticationPrincipal User currentUser) {

        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }

        try {
            // 1. Get and validate existing product
            Product existingProduct = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            // 2. Verify product belongs to current user
            if (!existingProduct.getProductSeller().getId().equals(currentUser.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only edit your own products");
            }

            // 3. Convert string parameters to enums
            GenderProduct genderProductEnum = GenderProduct.valueOf(genderProduct);
            ProductSize productSizeEnum = ProductSize.valueOf(productSize);
            ProductState productStateEnum = ProductState.valueOf(productState);
            float price = Float.parseFloat(productPrice);

            // 4. Handle image update if new file provided
            CategoryProduct category = existingProduct.getCategoryProduct();
            if (file != null && !file.isEmpty()) {
                String aiCategory = pythonTaggingClient.predictCategory(file);
                category = mapToCategory(aiCategory);

                String fileName = saveUploadedImage(file);
                String imageUrl = "http://localhost:8088/barkachni/uploads/" + fileName;
                existingProduct.setProductImageURL(imageUrl);
            }

            // 5. Update product fields
            existingProduct.setNameProduct(nameProduct);
            existingProduct.setCategoryProduct(category);
            existingProduct.setGenderProduct(genderProductEnum);
            existingProduct.setProductPrice(price);
            existingProduct.setProductDescription(productDescription);
            existingProduct.setProductSize(productSizeEnum);
            existingProduct.setProductState(productStateEnum);
            // Keep original dateAdded and seller

            Product updatedProduct = productService.modifyProduct(existingProduct);
            return ResponseEntity.ok(updatedProduct);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid enum value: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating product: " + e.getMessage());
        }
    }

}




