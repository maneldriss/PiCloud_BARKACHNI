package com.barkachni.barkachni.Services.marketplaceService;

import com.barkachni.barkachni.entities.marketplaceEntity.Product;
import com.barkachni.barkachni.entities.user.User;
import com.barkachni.barkachni.repository.ProductRepository;
import com.barkachni.barkachni.entities.user.UserRepository;
import com.barkachni.barkachni.security.JwtFilter;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
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
    public Product addProduct(Product p, Integer userId) {
        //Product product1 = productRepository.save(p);
        String username = JwtFilter.CURRENT_USER;
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé"));

        p.setProductSeller(user);
        p.setDateProductAdded(new Date()); // Optionnel : si la date n'est pas déjà définie

        return productRepository.save(p);
    }

    @Override
    @Transactional
    public void removeProduct(long productId) {
        productRepository.deleteById(productId);

    }
    @Override
    public Product modifyProduct(Product product) {
        return productRepository.save(product);    }

    //for reservation purposes
   public Product reserveProduct(Long productId, int id) {
        Product product = productRepository.findById(productId).orElseThrow();
        if (product.isReserved()) {
            throw new IllegalStateException("Product is already reserved.");
        }

        User user = userRepository.findById(id).orElseThrow();

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
            p.setReserved(false);
            p.setReservedBy(null);
            p.setReservationExpiry(null);
            productRepository.save(p);
            return true;  // Unreservation successful
        }
        return false;  // Product not found or not reserved
    }

}
