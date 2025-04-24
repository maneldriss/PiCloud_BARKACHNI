package com.barkachni.barkachni.entities.donationEntity;


import com.barkachni.barkachni.entities.Dressing.Item;
import com.barkachni.barkachni.entities.user.User;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.ToString;
import com.fasterxml.jackson.annotation.JsonInclude;


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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DonationStatus status = DonationStatus.PENDING; // Valeur par défaut


    @Positive(message = "Le montant doit être positif")
    @DecimalMin(value = "0.01", message = "Le montant minimum est 0.01")
    private Double amount;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @OneToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "item_id")
    @JsonIgnore
    private Item itemDressing;

    @ManyToOne
    @JsonIdentityReference(alwaysAsId = true)
    @JsonIgnore
    private User donor;


    public Donation(int donationId, DonationType donationType, Double amount, Item itemDressing, User donor) {
        this.donationId = donationId;
        this.donationType = donationType;
        this.amount = amount;
        this.itemDressing = itemDressing;
        this.donor = donor;
        this.status = DonationStatus.PENDING;

    }

    public Donation(DonationType donationType, Double amount, Item itemDressing, User donor) {
        this.donationType = donationType;
        this.amount = amount;
        this.itemDressing = itemDressing;
        this.donor = donor;
        this.status = DonationStatus.PENDING;

    }

    public Donation() {

    }


    public int getDonationId() {
        return donationId;
    }

    public DonationType getDonationType() {
        return donationType;
    }

    public DonationStatus getStatus() {
        return status;
    }

    public void setStatus(DonationStatus status) {
        this.status = status;
    }

    public Double getAmount() {
        return amount;
    }

    public Item getItemDressing() {
        return itemDressing;
    }

    public User getDonor() {
        return donor;
    }

    public void setDonationId(int donationId) {
        this.donationId = donationId;
    }

    public void setDonationType(DonationType donationType) {
        this.donationType = donationType;
    }



    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public void setItemDressing(Item itemDressing) {
        this.itemDressing = itemDressing;
    }

    public void setDonor(User donor) {
        this.donor = donor;
    }



    @Override
    public String toString() {
        return "Donation{" +
                "donationId=" + donationId +
                ", donationType=" + donationType +

                ", amount=" + amount +
                ", itemDressing=" + (itemDressing != null ? itemDressing.getItemID() : "null") +
                ", donor=" + (donor != null ? donor.getId() : "null") +
                ", status=" + status +

                '}';
    }


}