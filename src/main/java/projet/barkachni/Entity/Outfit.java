package projet.barkachni.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Outfit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long outfitID;

    @NotBlank(message = "Outfit name cannot be blank")
    @Size(max = 50, message = "Outfit name cannot exceed 50 characters")
    private String outfitName;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    @Size(max = 1000, message = "Image URL is too long")
    private String imageUrl;

    private LocalDateTime dateCreated;

    private String season;

    private String occasion;

    @ManyToMany
    @JoinTable(
            name = "outfit_item",
            joinColumns = @JoinColumn(name = "outfit_id"),
            inverseJoinColumns = @JoinColumn(name = "item_id")
    )
    @JsonIgnoreProperties({"user"})
    private List<Item> items;

    @ManyToOne
    @JoinColumn(name = "dressing_id")
    @JsonIgnoreProperties("outfits")
    private Dressing dressing;
}
