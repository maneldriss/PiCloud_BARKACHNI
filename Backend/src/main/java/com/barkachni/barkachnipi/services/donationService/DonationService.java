package com.barkachni.barkachnipi.services.donationService;

import com.barkachni.barkachnipi.entities.donationEntity.Donation;
import com.barkachni.barkachnipi.entities.donationEntity.DonationStatus;
import com.barkachni.barkachnipi.repositories.donationRepository.DonationRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class DonationService implements IDonationService {
   @Autowired
    DonationRepository donationRepository;
    @Override
    public Optional<Donation> getDonationById(int id) {
        return donationRepository.findById(id);
    }
    @Override
    public List<Donation> retrieveAllDonation() {
        return donationRepository.findAll();
    }

    @Override
    public Donation retrieveDonation(int donationId) {
        return donationRepository.findById(donationId).get();
    }

    @Override
    public Donation addDonation(Donation d) {
        return donationRepository.save(d);
    }

    @Override
    public void removeDonation(int donationId) {
        donationRepository.deleteById(donationId);
    }

    @Override
    public Donation modifyDonation(Donation donation) {
        return donationRepository.save(donation);
    }
    @Override
    public List<Donation> getDonationsByStatus(DonationStatus status) {
        return donationRepository.findByStatus(status);
    }


}
