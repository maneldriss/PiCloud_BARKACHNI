package com.barkachni.barkachnipi.entities.brandEntity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;

import java.util.Set;

@Entity
public class Brand {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String address;

    @Email
    private String email;
    // One-to-Many relationship with Ads using Set
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<Ad> ads;

    // Constructors
    public Brand() {}

    public Brand(Long id, String name, String address, String email, Set<Ad> ads) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.email = email;
        this.ads = ads;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getAddress() {
        return address;
    }

    public String getEmail() {
        return email;
    }

    public Set<Ad> getAds() {
        return ads;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Brand name cannot be empty");
        }
        this.name = name;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setEmail(String email) {
        if (email != null && !email.trim().isEmpty()) {
            this.email = email;
        }
    }

    public void setAds(Set<Ad> ads) {
        this.ads = ads;
    }


}
