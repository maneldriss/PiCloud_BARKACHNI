package com.barkachni.barkachnipi.entities.cartEntity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import com.barkachni.barkachnipi.entities.userEntity.User;

import java.util.Set;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level= AccessLevel.PRIVATE)
@Entity
public class Cart {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    Long cartID;

    @OneToOne
    private User user;

    @OneToMany(cascade = CascadeType.PERSIST)
    private Set<ItemCart> itemCarts;


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

    public void setUser(User user) {
        this.user = user;
    }

    public Set<ItemCart> getItemCarts() {
        return itemCarts;
    }

    public void setItemCarts(Set<ItemCart> itemCarts) {
        this.itemCarts = itemCarts;
    }

}
