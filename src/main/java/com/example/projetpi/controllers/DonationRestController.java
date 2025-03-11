package com.example.projetpi.controllers;

import com.example.projetpi.entities.Donation;
import com.example.projetpi.entities.DonationType;
import com.example.projetpi.services.IDonationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/donation")
public class DonationRestController {

    @Autowired
    IDonationService donationService;

    @Autowired
    public DonationRestController(IDonationService donationService){
        this.donationService = donationService;
    }

    @GetMapping("/retrieve-all-donations")
    public List<Donation> getDonations() {
        return donationService.retrieveAllDonation();
    }

    @GetMapping("/retrieve-donation/{donation-id}")
    public Donation retrieveDonation(@PathVariable("donation-id") int dId) {
        return donationService.retrieveDonation(dId);
    }

    /**@PostMapping("/add-donation")
    public Donation addDonation(@RequestBody Donation d){
        return donationService.addDonation(d);
   }*/
    @PostMapping("/add-donation")
    public Donation addDonation(@RequestBody @Valid Donation donation) {
        // Validate and handle different donation types
        if (donation.getDonationType() == DonationType.MONEY) {
            // If donation type is MONEY, clothingItem and quantity should be ignored or nullified
            donation.setClothingItem(null);  // Ensure no clothing item for MONEY donation
            donation.setQuantity(0);         // Ensure quantity is 0 for MONEY donation
        } else if (donation.getDonationType() == DonationType.CLOTHING) {
            // If donation type is CLOTHING, validate that clothingItem and quantity are provided
            if (donation.getClothingItem() == null || donation.getClothingItem().isEmpty()) {
                throw new IllegalArgumentException("Clothing item must be provided for CLOTHING donation.");
            }
            if (donation.getQuantity() <= 0) {
                throw new IllegalArgumentException("Quantity must be greater than 0 for CLOTHING donations.");
            }
        }
        return donationService.addDonation(donation);
    }


            @DeleteMapping("/remove-donation/{donation-id}")
            public void removeDonation ( @PathVariable("donation-id") int dId){
                donationService.removeDonation(dId);
            }

            @PutMapping("/modify-donation")
            public Donation modifyProjet (@RequestBody Donation d){
                Donation donation = donationService.modifyDonation(d);
                return donation;
            }

        }
