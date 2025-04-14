package com.barkachni.barkachnipi.services.donationService;

import com.barkachni.barkachnipi.entities.donationEntity.Donation;
import com.barkachni.barkachnipi.entities.donationEntity.DonationStatus;
import com.barkachni.barkachnipi.entities.donationEntity.DonationType;
import com.barkachni.barkachnipi.entities.userEntity.user;
import com.barkachni.barkachnipi.repositories.donationRepository.DonationRepository;
import com.barkachni.barkachnipi.repositories.userRepository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@AllArgsConstructor
public class DonationService implements IDonationService {
   @Autowired
    DonationRepository donationRepository;
    @Autowired
    UserRepository userRepository;


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
    @Transactional
    public Donation addDonation(Donation donation) {
        // 1. Validations de base
        if (donation.getDonor() == null) {
            throw new IllegalArgumentException("Le donateur ne peut pas être null");
        }
        if (donation.getDonationType() == null) {
            throw new IllegalArgumentException("Le type de don doit être spécifié");
        }

        // 2. Récupération du donateur
        user donor = userRepository.findById(donation.getDonor().getIdUser())
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));

        // 3. Initialisation des points si null
        donor.setDonationPoints(Optional.ofNullable(donor.getDonationPoints()).orElse(0));

        // 4. Calcul des points UNIQUEMENT si le don est approuvé
        if (donation.getStatus() == DonationStatus.APPROVED) {
            int pointsEarned = calculatePoints(donation);
            donor.setDonationPoints(donor.getDonationPoints() + pointsEarned);

            // Journalisation pour débogage
            System.out.printf("[DEBUG] Ajout de %d points pour %s. Nouveau total: %d%n",
                    pointsEarned, donor.getEmail(), donor.getDonationPoints());
        }

        // 5. Sauvegarde
        userRepository.save(donor);
        donation.setDonor(donor);
        return donationRepository.save(donation);
    }

    public int calculatePoints(Donation donation) {
        if (donation.getStatus() != DonationStatus.APPROVED) {
            return 0;
        }

        if (donation.getDonationType() == DonationType.MONEY) {
            if (donation.getAmount() == null || donation.getAmount() <= 0) {
                throw new IllegalArgumentException("Montant invalide pour un don financier");
            }
            return (int) Math.round(donation.getAmount());
        }
        else if (donation.getDonationType() == DonationType.CLOTHING) {
            if (donation.getItemDressing() == null) {
                throw new IllegalArgumentException("Item manquant pour un don matériel");
            }
            return 10; // Note: Vous avez changé 50 → 10, assurez-vous que c'est intentionnel
        }

        throw new IllegalArgumentException("Type de don non reconnu");
    }
    @Transactional
    public void recalculateUserPoints(Long userId) {
        user user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Utilisez la bonne colonne dans @Query
        List<Donation> approvedDonations = donationRepository.findApprovedDonationsByUser(userId);

        int totalPoints = approvedDonations.stream()
                .mapToInt(this::calculatePoints)
                .sum();

        user.setDonationPoints(totalPoints);
        userRepository.save(user);
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
