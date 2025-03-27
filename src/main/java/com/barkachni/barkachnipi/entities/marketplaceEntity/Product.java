package com.barkachni.barkachnipi.entities.marketplaceEntity;

import com.barkachni.barkachnipi.entities.userEntity.user;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;
    private String nameProduct;
    @Enumerated(EnumType.STRING)
    private CategoryProduct categoryProduct;
    @ManyToOne(cascade = CascadeType.PERSIST)
    private user productSeller;
    private Date dateProductAdded;
    private String productImageURL;
    private String productDescription;
    private float productPrice;
    @Enumerated(EnumType.STRING)
    private ProductState productState;

    public ProductState getProductState() {
        return productState;
    }

    public void setProductState(ProductState productState) {
        this.productState = productState;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getNameProduct() {
        return nameProduct;
    }

    public void setNameProduct(String nameProduct) {
        this.nameProduct = nameProduct;
    }

    public CategoryProduct getCategoryProduct() {
        return categoryProduct;
    }

    public void setCategoryProduct(CategoryProduct categoryProduct) {
        this.categoryProduct = categoryProduct;
    }

    public user getProductSeller() {
        return productSeller;
    }

    public void setProductSeller(user productSeller) {
        this.productSeller = productSeller;
    }

    public Date getDateProductAdded() {
        return dateProductAdded;
    }

    public void setDateProductAdded(Date dateProductAdded) {
        this.dateProductAdded = dateProductAdded;
    }

    public String getProductImageURL() {
        return productImageURL;
    }

    public void setProductImageURL(String productImageURL) {
        this.productImageURL = productImageURL;
    }

    public String getProductDescription() {
        return productDescription;
    }

    public void setProductDescription(String productDescription) {
        this.productDescription = productDescription;
    }

    public float getProductPrice() {
        return productPrice;
    }

    public void setProductPrice(float productPrice) {
        this.productPrice = productPrice;
    }
}

