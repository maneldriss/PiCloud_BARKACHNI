package projet.barkachni.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userID;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "user")
    private List<Item> items;

    @OneToOne(cascade = CascadeType.ALL, mappedBy = "user")
    private Dressing dressing;
}
