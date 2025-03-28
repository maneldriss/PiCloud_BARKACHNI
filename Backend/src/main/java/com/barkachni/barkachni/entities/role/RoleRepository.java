package com.barkachni.barkachni.entities.role;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role_user, Integer> {
    Optional<Role_user> findByName(String name);
}