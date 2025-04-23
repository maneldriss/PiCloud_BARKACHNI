package projet.barkachni.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import projet.barkachni.Entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
}
