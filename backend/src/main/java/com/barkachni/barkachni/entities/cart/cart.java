package com.barkachni.barkachni.entities.cart;

import com.barkachni.barkachni.entities.user.User;
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
public class cart {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    Long cartID;
    private double total;
    @OneToOne
   private User user;

    @OneToMany(cascade = CascadeType.ALL,  orphanRemoval = true,fetch = FetchType.EAGER)
    private Set<Cartitem> Cartitems;
    public boolean removeItem(Cartitem item) {
        return Cartitems.remove(item);}

    // Getters and Setters

    public Long getCartID() {
        return cartID;
    }

    public void setCartID(Long cartID) {
        this.cartID = cartID;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User User) {
        this.user = User;
    }

    public Set<Cartitem> getCartitems() {
        return Cartitems;
    }

    public void setCartitems(Set<Cartitem> Cartitems) {
        this.Cartitems = Cartitems;
    }
    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }
}



