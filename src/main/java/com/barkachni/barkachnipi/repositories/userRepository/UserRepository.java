package com.barkachni.barkachnipi.repositories.userRepository;

import com.barkachni.barkachnipi.entities.userEntity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findAll();

}
