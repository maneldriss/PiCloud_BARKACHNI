package com.barkachni.barkachni.Services.marketplaceService;

import com.barkachni.barkachni.entities.marketplaceEntity.Product;
import com.barkachni.barkachni.entities.user.User;

import java.util.List;

public interface IProductService {
    public List<Product> retrieveAllProducts();
    public Product retrieveProduct(long productId);

    Product addProduct(Product p, Integer userId);

    public void removeProduct(long productId);
    public Product modifyProduct(Product product);

    boolean unreserveProduct(Long productId);

    //for reservation purposes
    Product reserveProduct(Long productId, User currentUser);

    List<Product> getReservedProducts();

    List<Product> retrieveProductsBySellerId(Integer id);
}
