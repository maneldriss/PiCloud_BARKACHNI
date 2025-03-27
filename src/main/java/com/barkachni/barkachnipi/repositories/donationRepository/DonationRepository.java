package com.barkachni.barkachnipi.repositories.donationRepository;

import com.barkachni.barkachnipi.entities.donationEntity.Donation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DonationRepository extends JpaRepository<Donation, Integer> {
}
