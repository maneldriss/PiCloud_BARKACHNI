package com.barkachni.barkachni.controllers.donationController;

import com.barkachni.barkachni.Services.Dressing.IItemService;
import com.barkachni.barkachni.entities.Dressing.Item;
import com.barkachni.barkachni.entities.donationEntity.Donation;
import com.barkachni.barkachni.entities.donationEntity.DonationStatus;
import com.barkachni.barkachni.entities.donationEntity.DonationType;
import com.barkachni.barkachni.entities.user.User;
import com.barkachni.barkachni.repositories.donationRepository.DonationRepository;
import com.barkachni.barkachni.Services.donationService.LeaderboardService;
import com.barkachni.barkachni.entities.user.UserRepository;
import com.barkachni.barkachni.Services.donationService.EmailService;
import com.barkachni.barkachni.Services.donationService.IDonationService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/donation")
public class DonationRestController {
    private final IDonationService donationService;
    private final IItemService itemService;
    private final UserRepository userRepository;
    private final DonationRepository donationRepository;

    @Autowired
    public DonationRestController(
            IDonationService donationService,
            IItemService itemService,
            UserRepository userRepository,
            DonationRepository donationRepository) {
        this.donationService = donationService;
        this.itemService = itemService;
        this.userRepository = userRepository;
        this.donationRepository=donationRepository;
        System.out.println("UserRepository injected: " + (this.userRepository != null));

    }
    @Autowired
    private LeaderboardService leaderboardService;

    @Autowired
    private EmailService emailService;
    /*@GetMapping("/retrieve-all-donations")
    public List<Donation> getDonations() {
        return donationService.retrieveAllDonation();
    }*/
    @GetMapping("/retrieve-all-donations")
    public ResponseEntity<List<Donation>> getAllDonations() {
        System.out.println("Requête pour tous les dons reçue");
        List<Donation> donations = donationService.retrieveAllDonation();

        System.out.println("Donations being returned:");
        donations.forEach(d -> System.out.println(d.toString()));

        return ResponseEntity.ok(donations);
    }

    @PostMapping("/add-donation")
    public ResponseEntity<?> addDonation(
            @RequestBody @Valid Donation donation,
            @AuthenticationPrincipal User currentUser) {

        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }

        try {
            // Handle clothing donations with item
            if (donation.getDonationType() == DonationType.CLOTHING) {
                if (donation.getItemDressing() == null || donation.getItemDressing().getItemID() == 0) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Item ID is required for clothing donations");
                }
                
                // Fetch the actual item from the database
                Item item = itemService.retrieveItem(donation.getItemDressing().getItemID());
                donation.setItemDressing(item);
            }
            
            // Call the service method with the donation and the user's ID
            Donation savedDonation = donationService.addDonation(donation, currentUser.getId());

            return ResponseEntity.status(HttpStatus.CREATED).body(savedDonation);
        } catch (Exception e) {
            log.error("Error while adding donation: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding donation: " + e.getMessage());
        }
    }


    @PostMapping("/recalculate-points/{userId}")
    public ResponseEntity<String> recalculateUserPoints(@PathVariable Integer userId) {
        try {
            donationService.recalculateUserPoints(userId);
            return ResponseEntity.ok("Points recalculés avec succès pour l'utilisateur ID: " + userId);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors du recalcul: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}/total-approved")
    public ResponseEntity<Double> getTotalApprovedDonations(@PathVariable Long userId) {
        Double total = donationRepository.sumApprovedDonationsByUser(userId);
        return ResponseEntity.ok(total != null ? total : 0.0);
    }

    @DeleteMapping("/remove-donation/{donation-id}")
    public void removeDonation(@PathVariable("donation-id") int dId) {
        donationService.removeDonation(dId);
    }


   @PutMapping("/modify-donation/{id}")
   public ResponseEntity<Donation> modifyDonation(
           @PathVariable int id,
           @RequestBody @Valid Donation updatedDonation) {

       Donation existingDonation = donationService.getDonationById(id)
               .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Donation non trouvée"));

       updatedDonation.setDonationId(id);
       updatedDonation.setDonor(existingDonation.getDonor());

       if (updatedDonation.getDonationType() == DonationType.MONEY) {
           updatedDonation.setItemDressing(null);
           existingDonation.setAmount(updatedDonation.getAmount());
       } else if (updatedDonation.getDonationType() == DonationType.CLOTHING) {
           if (updatedDonation.getItemDressing() == null || updatedDonation.getItemDressing().getItemID() == null) {
               throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Item requis pour CLOTHING");
           }

           Item item = itemService.retrieveItem(updatedDonation.getItemDressing().getItemID());
           updatedDonation.setItemDressing(item);
           updatedDonation.setAmount(null);
       }

       existingDonation.setDonationType(updatedDonation.getDonationType());
       existingDonation.setAmount(updatedDonation.getAmount());
       existingDonation.setItemDressing(updatedDonation.getItemDressing());

       return ResponseEntity.ok(donationService.modifyDonation(existingDonation));
   }
    @GetMapping("/retrieve-donation/{id}")
    public ResponseEntity<Donation> getDonationById(@PathVariable int id) {
        Donation donation = donationService.getDonationById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Donation not found"));
        return ResponseEntity.ok(donation);
    }
    @GetMapping("/available-items")
    public List<Item> getAvailableItems() {
        return itemService.retrieveAllItems();
    }


    @PatchMapping("/approve/{id}")
    public ResponseEntity<Donation> approveDonation(@PathVariable int id) {
        Donation donation = donationService.getDonationById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        donation.setStatus(DonationStatus.APPROVED);
        Donation updatedDonation = donationService.modifyDonation(donation);
        donationService.recalculateUserPoints(updatedDonation.getDonor().getId());

        if (updatedDonation.getDonor() != null && updatedDonation.getDonor().getEmail() != null) {
            emailService.sendDonationStatusEmail(
                    updatedDonation.getDonor().getEmail(),
                    updatedDonation.getDonationType().toString(),
                    updatedDonation.getStatus().toString()
            );
        }

        return ResponseEntity.ok(updatedDonation);
    }

    @PatchMapping("/reject/{id}")
    public ResponseEntity<Donation> rejectDonation(@PathVariable int id) {
        Donation donation = donationService.getDonationById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        donation.setStatus(DonationStatus.REJECTED);
        Donation updatedDonation = donationService.modifyDonation(donation);

        if (updatedDonation.getDonor() != null && updatedDonation.getDonor().getEmail() != null) {
            emailService.sendDonationStatusEmail(
                    updatedDonation.getDonor().getEmail(),
                    updatedDonation.getDonationType().toString(),
                    updatedDonation.getStatus().toString()
            );
        }

        return ResponseEntity.ok(updatedDonation);
    }
    @GetMapping("/pending")
    public ResponseEntity<List<Donation>> getPendingDonations() {
        List<Donation> pendingDonations = donationService.getDonationsByStatus(DonationStatus.PENDING);
        return ResponseEntity.ok(pendingDonations);
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<Page<Map<String, Object>>> getTopDonors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return ResponseEntity.ok(leaderboardService.getTopDonors(page, size));
    }
    @GetMapping("/user/{userId}/points")
    public ResponseEntity<Integer> getUserPoints(@PathVariable Integer userId) {
        User donor = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        return ResponseEntity.ok(donor.getDonationPoints());
    }

}