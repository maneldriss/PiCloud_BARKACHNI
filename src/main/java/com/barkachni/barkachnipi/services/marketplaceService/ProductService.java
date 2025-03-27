package com.barkachni.barkachnipi.services.marketplaceService;

import com.barkachni.barkachnipi.entities.marketplaceEntity.Product;
import com.barkachni.barkachnipi.repositories.marketplaceRepository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService  implements IProductService{
    @Autowired
    ProductRepository productRepository;
    @Override
    public List<Product> retrieveAllProducts() {
        return productRepository.findAll();    }

    @Override
    public Product retrieveProduct(long productId) {
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

}
