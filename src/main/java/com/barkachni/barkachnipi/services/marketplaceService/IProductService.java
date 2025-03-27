package com.barkachni.barkachnipi.services.marketplaceService;

import com.barkachni.barkachnipi.entities.marketplaceEntity.Product;

import java.util.List;

public interface IProductService {
    public List<Product> retrieveAllProducts();
    public Product retrieveProduct(long productId);
    public Product addProduct(Product p);
    public void removeProduct(long productId);
    public Product modifyProduct(Product product);

}
