package com.example.demo.services;

import com.example.demo.entities.Product;

import java.util.List;

public interface IProductService {
    public List<Product> retrieveAllProducts();
    public Product retrieveProduct(long productId);
    public Product addProduct(Product p);
    public void removeProduct(long productId);
    public Product modifyProduct(Product product);
}
