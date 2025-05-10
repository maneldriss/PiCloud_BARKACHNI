package com.example.pi.entities;

import com.example.pi.repositories.ICartRepository;
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

    private String shippingAddress;

    private String status;

    private String paymentStatus;

    private String paymentMethod;

    private String shippingMethod;

    private double shippingCost;
    private double total;
    @OneToOne
    private user user;
    private Double discountApplied;  // New field
    private String discountType;     // New field (percentage/fixed)

    @OneToMany(cascade = CascadeType.PERSIST)
    private Set<Cartitem> Commandeitems;

    @OneToOne
    private cart cart;
    public Long getCommandeID() {
        return commandeID;
    }

    public void setCommandeID(Long commandeID) {
        this.commandeID = commandeID;
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

    public cart getCart() {
        return cart;
    }

    public void setCart(cart cart) {
        this.cart = cart;
    }
    public Set<Cartitem> getCommandeItems() {
        return Commandeitems;
    }

    public void setCommandeItems(Set<Cartitem> commandeItems) {
        this.Commandeitems = commandeItems;
    }
    public user getUser() {
        return user;
    }

    public void setUser(user user) {
        this.user = user;
    }
    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }
    public Double getDiscountApplied() {
        return discountApplied;
    }

    public void setDiscountApplied(Double discountApplied) {
        this.discountApplied = discountApplied;
    }

    public String getDiscountType() {
        return discountType;
    }

    public void setDiscountType(String discountType) {
        this.discountType = discountType;
    }
    @Override
    public String toString() {
        return "commande{" +
                "commandeID=" + commandeID +

                ", shippingAddress='" + shippingAddress + '\'' +
                ", status='" + status + '\'' +
                ", paymentStatus='" + paymentStatus + '\'' +
                ", paymentMethod='" + paymentMethod + '\'' +
                ", shippingMethod='" + shippingMethod + '\'' +
                ", shippingCost=" + shippingCost +
                ", cart=" + cart +
                '}';
    }

    public void calculateTotal() {
        double subtotal = this.Commandeitems.stream()
                .mapToDouble(item -> item.getProduct().getProductPrice() * item.getQuantity())
                .sum();

        // Apply discount if exists
        if (discountApplied != null && discountApplied > 0) {
            if ("percentage".equals(discountType)) {
                subtotal -= subtotal * (discountApplied / 100);
            } else if ("fixed".equals(discountType)) {
                subtotal -= discountApplied;
            }
        }

        this.total = subtotal + this.shippingCost;
    }
}
