package com.barkachni.barkachnipi.controllers.marketplaceController;

import com.barkachni.barkachnipi.entities.marketplaceEntity.*;
import com.barkachni.barkachnipi.entities.userEntity.User;
import com.barkachni.barkachnipi.repositories.marketplaceRepository.ProductRepository;
import com.barkachni.barkachnipi.repositories.userRepository.UserRepository;
import com.barkachni.barkachnipi.services.marketplaceService.IProductService;
import com.barkachni.barkachnipi.services.marketplaceService.PythonImageTaggingClient;
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
    @Autowired
    ProductRepository productRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    private PythonImageTaggingClient pythonTaggingClient;

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
   /* @PostMapping("/upload-image")
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
    }*/

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
    public ResponseEntity<Product> uploadWithAutoTag(
            @RequestParam("file") MultipartFile file,
            @RequestParam("nameProduct") String nameProduct,
            @RequestParam("genderProduct") GenderProduct genderProduct,
            @RequestParam("productPrice") float productPrice,
            @RequestParam("productDescription") String productDescription,
            @RequestParam("productSize") ProductSize productSize,
            @RequestParam("productSeller") Long sellerId,
            @RequestParam("productState") ProductState productState) {

        try {
            // 1. Call AI service
            String aiCategory = pythonTaggingClient.predictCategory(file);
            CategoryProduct category = mapToCategory(aiCategory);

            // 2. Save image
            String fileName = saveUploadedImage(file);
            String imageUrl = "http://localhost:8089/BarkachniPI/uploads/" + fileName;

            // 3. Get seller from ID
            User seller = userRepository.findById(sellerId)
                    .orElseThrow(() -> new RuntimeException("Seller not found"));

            // 4. Create and save product
            Product product = new Product();
            product.setNameProduct(nameProduct);
            product.setCategoryProduct(category);
            product.setGenderProduct(genderProduct);
            product.setProductPrice(productPrice);
            product.setProductDescription(productDescription);
            product.setProductSize(productSize);
            product.setProductImageURL(imageUrl);
            product.setProductSeller(seller);
            product.setProductState(productState);
            product.setDateProductAdded(new Date());

            Product savedProduct = productService.addProduct(product);
            return ResponseEntity.ok(savedProduct);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
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
}




