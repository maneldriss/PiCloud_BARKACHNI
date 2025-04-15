package com.barkachni.barkachnipi.entities.cartEntity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import com.barkachni.barkachnipi.entities.userEntity.User;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level= AccessLevel.PRIVATE)
@Entity
public class Commande {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    Long commandeID;
    @ManyToOne
    private User user;
    private String shippingAddress;

    private String status;

    private String paymentStatus;

    private String paymentMethod;

    private String shippingMethod;

    private double shippingCost;



    @OneToOne
    private Cart cart;
    public Long getCommandeID() {
        return commandeID;
    }

    public void setCommandeID(Long commandeID) {
        this.commandeID = commandeID;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getShippingMethod() {
        return shippingMethod;
    }

    public void setShippingMethod(String shippingMethod) {
        this.shippingMethod = shippingMethod;
    }

    public double getShippingCost() {
        return shippingCost;
    }

    public void setShippingCost(double shippingCost) {
        this.shippingCost = shippingCost;
    }

    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }

    @Override
    public String toString() {
        return "commande{" +
                "commandeID=" + commandeID +
                ", user=" + user +
                ", shippingAddress='" + shippingAddress + '\'' +
                ", status='" + status + '\'' +
                ", paymentStatus='" + paymentStatus + '\'' +
                ", paymentMethod='" + paymentMethod + '\'' +
                ", shippingMethod='" + shippingMethod + '\'' +
                ", shippingCost=" + shippingCost +
                ", cart=" + cart +
                '}';
    }
}
