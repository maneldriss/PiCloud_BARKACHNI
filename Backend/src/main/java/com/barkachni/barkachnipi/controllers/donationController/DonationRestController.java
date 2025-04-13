package com.barkachni.barkachnipi.controllers.donationController;

import com.barkachni.barkachnipi.entities.donationEntity.Donation;
import com.barkachni.barkachnipi.entities.donationEntity.DonationStatus;
import com.barkachni.barkachnipi.entities.donationEntity.DonationType;
import com.barkachni.barkachnipi.entities.dressingEntity.ItemDressing;
import com.barkachni.barkachnipi.entities.userEntity.user;
import com.barkachni.barkachnipi.repositories.userRepository.UserRepository;
import com.barkachni.barkachnipi.services.EmailService;
import com.barkachni.barkachnipi.services.donationService.IDonationService;
import com.barkachni.barkachnipi.services.dressingService.IDressingItemService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200") // À ajouter
@RequestMapping("/donation")
public class DonationRestController {
    private final IDonationService donationService;
    private final IDressingItemService itemService;
    private final UserRepository userRepository;

    @Autowired
    public DonationRestController(
            IDonationService donationService,
            IDressingItemService itemService,
            UserRepository userRepository
    ) {
        this.donationService = donationService;
        this.itemService = itemService;
        this.userRepository = userRepository;
    }
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
   /*@PostMapping("/add-donation")
    public Donation addDonation(@RequestBody @Valid Donation donation,
                                @RequestParam Long userId) {
        user donor = new user();
        donor.setIdUser(userId);

        donation.setDonor(donor);

        if (donation.getDonationType() == DonationType.MONEY) {
            donation.setItemDressing(null);
            if (donation.getAmount() == null || donation.getAmount() <= 0) {
                throw new IllegalArgumentException("Amount must be greater than 0 for MONEY donations.");
            }
        } else if (donation.getDonationType() == DonationType.CLOTHING) {
            if (donation.getItemDressing() == null) {
                throw new IllegalArgumentException("ItemDressing must be provided for CLOTHING donation.");
            }
            if (donation.getItemDressing().getUser() == null) {
                donation.getItemDressing().setUser(donor);
            }
        }

        return donationService.addDonation(donation);
    }*/
    ////////
   @PostMapping("/add-donation")
   public ResponseEntity<Donation> addDonation(
           @RequestBody @Valid Donation donation,
           @RequestParam Long userId) {

       // 1. Vérifier que l'utilisateur existe
       user donor = userRepository.findById(userId)
               .orElseThrow(() -> new ResponseStatusException(
                       HttpStatus.NOT_FOUND, "User not found"));

       // 2. Initialiser le statut
       donation.setStatus(DonationStatus.PENDING);
       donation.setDonor(donor);

       // 3. Traitement spécifique selon le type
       if (donation.getDonationType() == DonationType.CLOTHING) {
           if (donation.getItemDressing() == null || donation.getItemDressing().getItemID() == null) {
               throw new ResponseStatusException(
                       HttpStatus.BAD_REQUEST,
                       "Item ID is required for CLOTHING donation");
           }

           // 4. Récupérer l'item complet depuis la base
           ItemDressing item = itemService.retrieveItem(donation.getItemDressing().getItemID());
           donation.setItemDressing(item);
       }

       // 5. Sauvegarder
       Donation savedDonation = donationService.addDonation(donation);
       return ResponseEntity.ok(savedDonation);
   }


    @DeleteMapping("/remove-donation/{donation-id}")
    public void removeDonation(@PathVariable("donation-id") int dId) {
        donationService.removeDonation(dId);
    }


   /*@PutMapping("/modify-donation/{id}")
   public ResponseEntity<Donation> modifyDonation(
           @PathVariable int id,
           @RequestBody @Valid Donation updatedDonation) {

       Donation existingDonation = donationService.getDonationById(id)
               .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Donation non trouvée"));

       // Mise à jour obligatoire de l'ID
       updatedDonation.setDonationId(id);

       // Transfert de l'utilisateur existant
       updatedDonation.setDonor(existingDonation.getDonor());

       if (updatedDonation.getDonationType() == DonationType.MONEY) {
           updatedDonation.setItemDressing(null);
       } else if (updatedDonation.getDonationType() == DonationType.CLOTHING) {
           if(updatedDonation.getItemDressing() == null) {
               throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Item requis pour CLOTHING");
           }
       }

       return ResponseEntity.ok(donationService.modifyDonation(updatedDonation));
   }*/
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

           ItemDressing item = itemService.retrieveItem(updatedDonation.getItemDressing().getItemID());
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
    public List<ItemDressing> getAvailableItems() {
        return itemService.retrieveAllItems();
    }


    /////////confirmation du donation/////////////
  /*  @PatchMapping("/approve/{id}")
    public ResponseEntity<Donation> approveDonation(@PathVariable int id) {
        Donation donation = donationService.getDonationById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Donation not found"));

        donation.setStatus(DonationStatus.APPROVED);
        return ResponseEntity.ok(donationService.modifyDonation(donation));
    }

    @PatchMapping("/reject/{id}")
    public ResponseEntity<Donation> rejectDonation(@PathVariable int id) {
        Donation donation = donationService.getDonationById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Donation not found"));

        donation.setStatus(DonationStatus.REJECTED);
        return ResponseEntity.ok(donationService.modifyDonation(donation));
    }
*/
    @PatchMapping("/approve/{id}")
    public ResponseEntity<Donation> approveDonation(@PathVariable int id) {
        Donation donation = donationService.getDonationById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        donation.setStatus(DonationStatus.APPROVED);
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
}