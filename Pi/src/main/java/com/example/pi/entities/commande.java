package com.example.pi.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level= AccessLevel.PRIVATE)
@Entity
public class commande {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    Long commandeID;
    @ManyToOne
    private user user;
    private String shippingAddress; // Shipping address

    private String status; // Order status (e.g., "pending", "shipped", etc.)

    private String paymentStatus; // Payment status (e.g., "paid", "pending", etc.)

    private String paymentMethod; // Payment method (e.g., "credit card", "paypal")

    private String shippingMethod; // Shipping method (e.g., "standard", "express")

    private double shippingCost;



    @OneToMany(cascade = CascadeType.ALL)
    private Set<item> items;
}
