package projet.barkachni.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import projet.barkachni.Entity.Outfit;

public interface OutfitRepository extends JpaRepository<Outfit, Long> {
}
