package com.example.pi.repositories;

import com.example.pi.entities.Cartitem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IitemRepository extends JpaRepository<Cartitem, Long> {
}
