package com.barkachni.barkachnipi.entities.donationEntity;

import com.barkachni.barkachnipi.entities.dressingEntity.ItemDressing;
import com.barkachni.barkachnipi.entities.userEntity.user;
import com.barkachni.barkachnipi.repositories.dressingRepository.ItemDressingRepository;
import com.barkachni.barkachnipi.repositories.userRepository.UserRepository;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.ToString;
import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.beans.factory.annotation.Autowired;


@Entity
@ToString
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "donation_id") // Assurer le mapping correct
    private int donationId;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Le type de donation ne peut pas être null")
    private DonationType donationType;


    @Positive(message = "Le montant doit être positif")
    @DecimalMin(value = "0.01", message = "Le montant minimum est 0.01")
    private Double amount;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @OneToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "item_dressing_id")
    private ItemDressing itemDressing;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @NotNull(message = "Le donateur ne peut pas être null")
    private user donor;

    // Constructeurs

    public Donation(int donationId, DonationType donationType, Double amount, ItemDressing itemDressing, user donor) {
        this.donationId = donationId;
        this.donationType = donationType;
        this.amount = amount;
        this.itemDressing = itemDressing;
        this.donor = donor;
    }

    public Donation(DonationType donationType, Double amount, ItemDressing itemDressing, user donor) {
        this.donationType = donationType;
        this.amount = amount;
        this.itemDressing = itemDressing;
        this.donor = donor;

    }

    public Donation() {

    }

    // Getters
    public int getDonationId() {
        return donationId;
    }

    public DonationType getDonationType() {
        return donationType;
    }



    public Double getAmount() {
        return amount;
    }

    public ItemDressing getItemDressing() {
        return itemDressing;
    }

    public user getDonor() {
        return donor;
    }

    // Setters
    public void setDonationId(int donationId) {
        this.donationId = donationId;
    }

    public void setDonationType(DonationType donationType) {
        this.donationType = donationType;
    }



    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public void setItemDressing(ItemDressing itemDressing) {
        this.itemDressing = itemDressing;
    }

    public void setDonor(user donor) {
        this.donor = donor;
    }



    @Override
    public String toString() {
        return "Donation{" +
                "donationId=" + donationId +
                ", donationType=" + donationType +

                ", amount=" + amount +
                ", itemDressing=" + (itemDressing != null ? itemDressing.getItemID() : "null") +
                ", donor=" + (donor != null ? donor.getIdUser() : "null") +
                '}';
    }

}