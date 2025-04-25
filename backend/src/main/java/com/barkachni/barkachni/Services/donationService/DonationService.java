package com.barkachni.barkachni.Services.donationService;

import com.barkachni.barkachni.entities.donationEntity.Donation;
import com.barkachni.barkachni.entities.donationEntity.DonationStatus;
import com.barkachni.barkachni.entities.donationEntity.DonationType;
import com.barkachni.barkachni.entities.user.User;
import com.barkachni.barkachni.entities.user.UserRepository;
import com.barkachni.barkachni.repositories.donationRepository.DonationRepository;
import com.barkachni.barkachni.security.JwtFilter;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Slf4j
@Service
@Transactional
@AllArgsConstructor
public class DonationService implements IDonationService {

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private UserRepository userRepository;

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
        return donationRepository.findById(donationId).orElseThrow(() -> new IllegalArgumentException("Donation not found"));
    }

    @Override
    @Transactional
    public Donation addDonation(Donation donation, Integer userId) {
        // Fetch the current user using the provided userId
        User currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("Authenticated user not found"));

        // Validate donation type
        if (donation.getDonationType() == null) {
            throw new IllegalArgumentException("Donation type must be specified");
        }

        // Set the donor to the authenticated user
        donation.setDonor(currentUser);

        // Initialize donation points if null
        currentUser.setDonationPoints(Optional.ofNullable(currentUser.getDonationPoints()).orElse(0));

        // Calculate and update points if the donation is approved
        if (donation.getStatus() == DonationStatus.APPROVED) {
            int pointsEarned = calculatePoints(donation);
            currentUser.setDonationPoints(currentUser.getDonationPoints() + pointsEarned);

            log.debug("[DEBUG] Added {} points for {}. New total: {}",
                    pointsEarned, currentUser.getEmail(), currentUser.getDonationPoints());
        }

        // Save the updated user and donation
        userRepository.save(currentUser);
        return donationRepository.save(donation);
    }

    public int calculatePoints(Donation donation) {
        if (donation.getStatus() != DonationStatus.APPROVED) {
            return 0;
        }

        if (donation.getDonationType() == DonationType.MONEY) {
            if (donation.getAmount() == null || donation.getAmount() <= 0) {
                throw new IllegalArgumentException("Invalid amount for financial donation");
            }
            return (int) Math.round(donation.getAmount());
        } else if (donation.getDonationType() == DonationType.CLOTHING) {
            if (donation.getItemDressing() == null) {
                throw new IllegalArgumentException("Missing item for material donation");
            }
            return 50;
        }

        throw new IllegalArgumentException("Unrecognized donation type");
    }

    @Transactional
    public void recalculateUserPoints(int userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Donation> approvedDonations = donationRepository.findApprovedDonationsByUser(userId);

        int totalPoints = approvedDonations.stream()
                .mapToInt(this::calculatePoints)
                .sum();

        user.setDonationPoints(totalPoints);
        userRepository.save(user);

        System.out.println("[DEBUG] Recalculated points for " + user.getEmail() + ": " + totalPoints);
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
