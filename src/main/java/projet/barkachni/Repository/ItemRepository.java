package projet.barkachni.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import projet.barkachni.Entity.Item;

public interface ItemRepository extends JpaRepository<Item, Long> {
}
