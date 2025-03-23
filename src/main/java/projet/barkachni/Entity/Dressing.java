package projet.barkachni.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Dressing {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is mandatory")
    @Column(nullable = false, length = 100)
    private String name;

    @OneToOne
    @JoinColumn(name = "userID")
    private User user;

    @OneToMany(mappedBy = "dressing", cascade = CascadeType.ALL)
    private List<Outfit> outfits;
}
