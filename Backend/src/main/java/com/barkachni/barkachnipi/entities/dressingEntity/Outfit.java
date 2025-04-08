package com.barkachni.barkachnipi.entities.dressingEntity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Outfit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long outfitID;

    @NotBlank(message = "Outfit name cannot be blank")
    @Size(max = 50, message = "Outfit name cannot exceed 50 characters")
    private String outfitName;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    @Size(max = 1000, message = "Image URL is too long")
    private String imageUrl;

    private LocalDateTime dateCreated;

    @ManyToMany
    @JoinTable(
            name = "outfit_item",
            joinColumns = @JoinColumn(name = "outfit_id"),
            inverseJoinColumns = @JoinColumn(name = "item_id")
    )
    private List<ItemDressing> itemDressings;

    public Long getOutfitID() {
        return outfitID;
    }

    public void setOutfitID(Long outfitID) {
        this.outfitID = outfitID;
    }

    public String getOutfitName() {
        return outfitName;
    }

    public void setOutfitName(String outfitName) {
        this.outfitName = outfitName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public LocalDateTime getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(LocalDateTime dateCreated) {
        this.dateCreated = dateCreated;
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

    @ManyToOne
    @JoinColumn(name = "dressing_id")
    private Dressing dressing;
}
