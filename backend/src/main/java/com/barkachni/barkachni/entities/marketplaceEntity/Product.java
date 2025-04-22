package com.barkachni.barkachni.entities.marketplaceEntity;

import com.barkachni.barkachni.entities.user.User;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
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
    @Enumerated(EnumType.STRING)
    private GenderProduct genderProduct;
    @ManyToOne(cascade = CascadeType.MERGE)
    @JsonBackReference
    private User productSeller;
    private Date dateProductAdded;
    private String productImageURL;
    private String productDescription;
    private float productPrice;
    @Enumerated(EnumType.STRING)
    private ProductState productState;
    @Enumerated(EnumType.STRING)
    private ProductSize productSize;

    //for reservation purposes
    private boolean reserved = false;
    @ManyToOne
    @JsonBackReference
    private User reservedBy;
    private LocalDateTime reservationExpiry;


    public boolean isReserved() {
        return reserved;
    }

    public void setReserved(boolean reserved) {
        this.reserved = reserved;
    }

    public User getReservedBy() {
        return reservedBy;
    }

    public void setReservedBy(User reservedBy) {
        this.reservedBy = reservedBy;
    }

    public LocalDateTime getReservationExpiry() {
        return reservationExpiry;
    }

    public void setReservationExpiry(LocalDateTime reservationExpiry) {
        this.reservationExpiry = reservationExpiry;
    }


    public ProductSize getProductSize() {
        return productSize;
    }

    public void setProductSize(ProductSize productSize) {
        this.productSize = productSize;
    }


    public GenderProduct getGenderProduct() {
        return genderProduct;
    }

    public void setGenderProduct(GenderProduct genderProduct) {
        this.genderProduct = genderProduct;
    }

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

    public User getProductSeller() {
        return productSeller;
    }

    public void setProductSeller(User productSeller) {
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

