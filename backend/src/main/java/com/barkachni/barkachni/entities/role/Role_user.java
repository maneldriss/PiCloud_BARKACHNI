package com.barkachni.barkachni.entities.role;

import com.barkachni.barkachni.entities.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity // Add this annotation to make it an entity
public class Role_user {
    @Id
    @GeneratedValue
    private Integer id;

    @Enumerated(EnumType.STRING) // Sauvegarde la valeur de l'enum en tant que String
    @Column(unique = true)
    private RoleName name;

    @ManyToMany(mappedBy = "roles") // Corrected the mappedBy attribute
    @JsonIgnore
    private List<User> users; // Changed the field name to "users" for clarity
}