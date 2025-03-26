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
public class cart {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    Long cartID;

    @OneToOne
    private user user;

    @OneToMany(cascade = CascadeType.PERSIST)
    private Set<item> items;


    // Getters and Setters

    public Long getCartID() {
        return cartID;
    }

    public void setCartID(Long cartID) {
        this.cartID = cartID;
    }

    public user getUser() {
        return user;
    }

    public void setUser(user user) {
        this.user = user;
    }

    public Set<item> getItems() {
        return items;
    }

    public void setItems(Set<item> items) {
        this.items = items;
    }
}


