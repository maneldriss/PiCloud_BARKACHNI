package com.barkachni.barkachnipi.entities.dressingEntity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.barkachni.barkachnipi.entities.userEntity.user;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ItemDressing {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long itemID;

    @NotBlank(message = "Item name cannot be blank")
    @Size(max = 50, message = "Item name cannot exceed 50 characters")
    @Column(nullable = false, length = 50)
    private String itemName;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    @NotNull(message = "Category must be provided")
    @Enumerated(EnumType.STRING)
    private CategoryDressing category;

    @NotBlank(message = "Color cannot be blank")
    private String color;

    @NotBlank(message = "Size cannot be blank")
    private String size;

    @NotBlank(message = "Brand cannot be blank")
    private String brand;

    @PositiveOrZero(message = "Price must be a positive value or zero")
    private float price;

    @Size(max = 1000, message = "Image URL is too long")
    private String imageUrl;

    private LocalDateTime dateAdded;

    public Long getItemID() {
        return itemID;
    }

    public void setItemID(Long itemID) {
        this.itemID = itemID;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public CategoryDressing getCategory() {
        return category;
    }

    public void setCategory(CategoryDressing category) {
        this.category = category;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public float getPrice() {
        return price;
    }

    public void setPrice(float price) {
        this.price = price;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public LocalDateTime getDateAdded() {
        return dateAdded;
    }

    public void setDateAdded(LocalDateTime dateAdded) {
        this.dateAdded = dateAdded;
    }

    public com.barkachni.barkachnipi.entities.userEntity.user getUser() {
        return user;
    }

    public void setUser(com.barkachni.barkachnipi.entities.userEntity.user user) {
        this.user = user;
    }

    @ManyToOne
    @JoinColumn(name = "userID")
    @JsonIgnore
    private user user;
}
