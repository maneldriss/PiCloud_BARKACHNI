package com.example.projetpi.entities;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
@Getter
@Setter
@ToString
@AllArgsConstructor

@Entity
public class Donation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int donationId;

    @Enumerated(EnumType.STRING)
    private DonationType donationType;

    private Date donationDate;
    private Double amount;
    @JsonInclude(JsonInclude.Include.NON_NULL) // Ignore if null (for MONEY donations)
    private String clothingItem;

    @JsonInclude(JsonInclude.Include.NON_DEFAULT) // Ignore if quantity is 0 (for MONEY donations)
    private int quantity;
    private String cond;

    // Constructeur par défaut
    public Donation() {
    }

    // Constructeur avec tous les champs
    public Donation(int donationId, DonationType donationType, Date donationDate, Double amount, String clothingItem, Integer quantity, String cond) {
        this.donationId = donationId;
        this.donationType = donationType;
        this.donationDate = donationDate;
        this.amount = amount;
        this.clothingItem = clothingItem;
        this.quantity = quantity;
        this.cond = cond;
    }

    // Constructeur sans l'ID (utile pour la création d'un don)
    public Donation(DonationType donationType, Date donationDate, Double amount, String clothingItem, Integer quantity, String cond) {
        this.donationType = donationType;
        this.donationDate = donationDate;
        this.amount = amount;
        this.clothingItem = clothingItem;
        this.quantity = quantity;
        this.cond = cond;
    }

    // Getters et Setters

    public int getDonationId() {
        return donationId;
    }

    public void setDonationId(int donationId) {
        this.donationId = donationId;
    }

    public DonationType getDonationType() {
        return donationType;
    }

    public void setDonationType(DonationType donationType) {
        this.donationType = donationType;
    }

    public Date getDonationDate() {
        return donationDate;
    }

    public void setDonationDate(Date donationDate) {
        this.donationDate = donationDate;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getClothingItem() {
        return clothingItem;
    }

    public void setClothingItem(String clothingItem) {
        this.clothingItem = clothingItem;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getCond() {
        return cond;
    }

    public void setCond(String cond) {
        this.cond = cond;
    }

    // Méthode toString() pour afficher les détails de l'objet
    @Override
    public String toString() {
        return "Donation{" +
                "donationId=" + donationId +
                ", donationType=" + donationType +
                ", donationDate=" + donationDate +
                ", amount=" + amount +
                ", clothingItem='" + clothingItem + '\'' +
                ", quantity=" + quantity +
                ", cond='" + cond + '\'' +
                '}';
    }

}