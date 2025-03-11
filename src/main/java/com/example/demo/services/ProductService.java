package com.example.demo.services;

import com.example.demo.entities.Product;
import com.example.demo.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService implements IProductService{

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
