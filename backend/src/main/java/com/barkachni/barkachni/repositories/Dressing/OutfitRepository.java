package com.barkachni.barkachni.repositories.Dressing;

import com.barkachni.barkachni.entities.Dressing.Outfit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.net.Inet4Address;
import java.util.List;

public interface OutfitRepository extends JpaRepository<Outfit, Long> {
    List<Outfit> findByDressingUserId(Integer userID);
}
