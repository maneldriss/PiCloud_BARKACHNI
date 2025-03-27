package com.barkachni.barkachnipi.entities.userEntity;

import com.barkachni.barkachnipi.entities.dressingEntity.Dressing;
import com.barkachni.barkachnipi.entities.dressingEntity.ItemDressing;
import com.barkachni.barkachnipi.entities.marketplaceEntity.Product;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class user {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUser;
    @OneToMany(cascade = CascadeType.ALL, mappedBy="productSeller")
    private Set<Product> products;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "user")
    private List<ItemDressing> itemDressings;

    @OneToOne(cascade = CascadeType.ALL, mappedBy = "user")
    private Dressing dressing;
}
