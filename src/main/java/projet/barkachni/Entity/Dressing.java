package projet.barkachni.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
    @JsonIgnoreProperties({"items", "dressing"})
    private User user;

    @OneToMany(mappedBy = "dressing", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("dressing")
    private List<Outfit> outfits;
}
