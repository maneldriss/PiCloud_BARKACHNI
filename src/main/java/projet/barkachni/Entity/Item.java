package projet.barkachni.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long itemID;

    @NotBlank(message = "Item name cannot be blank")
    @Size(max = 50, message = "Item name cannot exceed 50 characters")
    @Column(nullable = false, length = 50)
    private String itemName;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    @NotNull(message = "Category must be provided")
    @Enumerated(EnumType.STRING)
    private Category category;

    @NotBlank(message = "Color cannot be blank")
    private String color;

    @NotBlank(message = "Size cannot be blank")
    private String size;

    @NotBlank(message = "Brand cannot be blank")
    private String brand;

    @Size(max = 1000, message = "Image URL is too long")
    private String imageUrl;

    private LocalDateTime dateAdded;

    private boolean favorite = false;

    @ManyToOne
    @JoinColumn(name = "userID")
    private User user;
}
