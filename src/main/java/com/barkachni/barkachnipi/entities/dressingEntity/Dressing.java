package com.barkachni.barkachnipi.entities.dressingEntity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.barkachni.barkachnipi.entities.userEntity.user;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Dressing {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is mandatory")
    @Column(nullable = false, length = 100)
    private String name;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public com.barkachni.barkachnipi.entities.userEntity.user getUser() {
        return user;
    }

    public void setUser(com.barkachni.barkachnipi.entities.userEntity.user user) {
        this.user = user;
    }

    public List<Outfit> getOutfits() {
        return outfits;
    }

    public void setOutfits(List<Outfit> outfits) {
        this.outfits = outfits;
    }

    @OneToOne
    @JoinColumn(name = "userID")
    private user user;

    @OneToMany(mappedBy = "dressing", cascade = CascadeType.ALL)
    private List<Outfit> outfits;
}
