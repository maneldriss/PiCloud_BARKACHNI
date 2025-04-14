package com.example.projettp.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // Assure-toi d'importer cette annotation
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@JsonIgnoreProperties({"posts", "commentaires"})  // Ignore les relations pour éviter le cycle de sérialisation
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUser;

    private String username;
    private String email;
    private String password;

    @OneToMany(mappedBy = "user")
    private List<Post> posts;

    @OneToMany(mappedBy = "user")
    private List<Commentaire> commentaires;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
