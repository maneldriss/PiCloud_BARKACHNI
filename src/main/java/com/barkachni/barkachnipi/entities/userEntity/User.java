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
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_user")
    private Long idUser;
    @OneToMany(cascade = CascadeType.ALL, mappedBy="productSeller")
    private Set<Product> products;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "user")
    private List<ItemDressing> itemDressings;

    @OneToOne(cascade = CascadeType.ALL, mappedBy = "user")
    private Dressing dressing;

    private Double latitude;
    private Double longitude;

    public Long getIdUser() {
        return idUser;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public void setIdUser(Long idUser) {
        this.idUser = idUser;
    }

    public String getNameUser() {
        return nameUser;
    }

    public void setNameUser(String nameUser) {
        this.nameUser = nameUser;
    }

    @Column(name = "name_user")
    private String nameUser;
}
