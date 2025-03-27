package com.barkachni.barkachnipi.controllers.marketplaceController;

import com.barkachni.barkachnipi.entities.marketplaceEntity.Product;
import com.barkachni.barkachnipi.services.marketplaceService.IProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name="Gestion MarketPlace")
@RestController
@AllArgsConstructor
@RequestMapping("/marketplace")
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
    // ttp://localhost:8089/PICloud/product/modify-product
    @PutMapping("/modify-product")
    public Product modifyProduct(@RequestBody Product p) {
        Product product = productService.modifyProduct(p);
        return product;
    }


}
