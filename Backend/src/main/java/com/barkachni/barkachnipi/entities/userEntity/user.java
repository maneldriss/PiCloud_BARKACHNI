package com.barkachni.barkachnipi.entities.userEntity;

import com.barkachni.barkachnipi.entities.dressingEntity.Dressing;
import com.barkachni.barkachnipi.entities.dressingEntity.ItemDressing;
import com.barkachni.barkachnipi.entities.marketplaceEntity.Product;
import jakarta.persistence.*;
import java.util.List;
import java.util.Set;

@Entity

public class user {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUser;
    @Column(unique = true, nullable = true) // nullable=true si l'email est optionnel
    private String email;
    @OneToMany(cascade = CascadeType.ALL, mappedBy="productSeller")
    private Set<Product> products;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "user")
    private List<ItemDressing> itemDressings;

    @OneToOne(cascade = CascadeType.ALL, mappedBy = "user")
    private Dressing dressing;

    // Getters et Setters manuels
    public Long getIdUser() {
        return idUser;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public void setIdUser(Long idUser) {
        this.idUser = idUser;
    }

    public Set<Product> getProducts() {
        return products;
    }

    public void setProducts(Set<Product> products) {
        this.products = products;
    }

    public List<ItemDressing> getItemDressings() {
        return itemDressings;
    }

    public void setItemDressings(List<ItemDressing> itemDressings) {
        this.itemDressings = itemDressings;
    }

    public Dressing getDressing() {
        return dressing;
    }

    public void setDressing(Dressing dressing) {
        this.dressing = dressing;
    }
}