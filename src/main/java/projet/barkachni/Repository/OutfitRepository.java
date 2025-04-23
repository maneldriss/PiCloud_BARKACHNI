package projet.barkachni.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import projet.barkachni.Entity.Outfit;

import java.util.List;

public interface OutfitRepository extends JpaRepository<Outfit, Long> {
    List<Outfit> findByDressing_User_UserID(Long userID);
}
