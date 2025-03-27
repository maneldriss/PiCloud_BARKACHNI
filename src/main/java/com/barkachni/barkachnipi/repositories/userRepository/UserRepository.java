package com.barkachni.barkachnipi.repositories.userRepository;

import com.barkachni.barkachnipi.entities.userEntity.user;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<user, Long> {

}
