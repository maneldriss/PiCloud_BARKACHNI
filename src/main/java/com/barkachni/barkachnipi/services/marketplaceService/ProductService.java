package com.barkachni.barkachnipi.services.marketplaceService;

import com.barkachni.barkachnipi.entities.marketplaceEntity.Product;
import com.barkachni.barkachnipi.entities.userEntity.User;
import com.barkachni.barkachnipi.repositories.marketplaceRepository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import com.barkachni.barkachnipi.repositories.userRepository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService  implements IProductService{
    @Autowired
    ProductRepository productRepository;
    @Autowired
    UserRepository userRepository;

    @Override
    public List<Product> retrieveAllProducts() {
        return productRepository.findAll();    }

    @Override
    public Product retrieveProduct(long productId) {
        System.out.println("Received productId: " + productId); // Debugging line
        return productRepository.findById(productId).get();    }

    @Override
    public Product addProduct(Product p) {
        return productRepository.save(p);    }

    @Override
    public void removeProduct(long productId) {
        productRepository.deleteById(productId);

    }
    @Override
    public Product modifyProduct(Product product) {
        return productRepository.save(product);    }

    //for reservation purposes
   public Product reserveProduct(Long productId, Long userId) {
        Product product = productRepository.findById(productId).orElseThrow();
        if (product.isReserved()) {
            throw new IllegalStateException("Product is already reserved.");
        }

        User user = userRepository.findById(userId).orElseThrow();

        product.setReserved(true);
        product.setReservedBy(user);
        product.setReservationExpiry(LocalDateTime.now().plusMinutes(2)); // for example
        return productRepository.save(product);
    }


    @Scheduled(fixedRate = 2 * 60 * 1000) // every hour
    public void clearExpiredReservations() {
        List<Product> expired = productRepository.findByReservationExpiryBefore(LocalDateTime.now());
        for (Product product : expired) {
            product.setReserved(false);
            product.setReservedBy(null);
            product.setReservationExpiry(null);
        }
        productRepository.saveAll(expired);
    }

    public List<Product> getReservedProducts() {
        return productRepository.findByReservedTrue();  // Get all reserved products
    }

    public boolean unreserveProduct(Long productId) {
        Optional<Product> product = productRepository.findById(productId);
        if (product.isPresent() && product.get().isReserved()) {
            // Only unreserve if the product is reserved
            Product p = product.get();
            p.setReserved(false);  // Set reserved status to false
            productRepository.save(p);
            return true;  // Unreservation successful
        }
        return false;  // Product not found or not reserved
    }

    @Override
    public List<Product> retrieveProductsBySellerId(Long userId) {
        return productRepository.findByProductSeller_IdUser(userId);
    }

}
