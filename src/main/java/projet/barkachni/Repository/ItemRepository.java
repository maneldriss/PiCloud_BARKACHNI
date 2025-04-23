package projet.barkachni.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import projet.barkachni.Entity.Item;

import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {
    List<Item> findByUser_UserID(Long userID);
}
