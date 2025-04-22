package com.barkachni.barkachni.Services.marketplaceService;

import com.barkachni.barkachni.entities.marketplaceEntity.Product;

import java.util.List;

public interface IProductService {
    public List<Product> retrieveAllProducts();
    public Product retrieveProduct(long productId);

    Product addProduct(Product p, Integer userId);

    public void removeProduct(long productId);
    public Product modifyProduct(Product product);
    public Product reserveProduct(Long productId, int userId);


    boolean unreserveProduct(Long productId);

    List<Product> getReservedProducts();
}
