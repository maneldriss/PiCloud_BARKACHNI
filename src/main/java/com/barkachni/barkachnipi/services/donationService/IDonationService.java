package com.barkachni.barkachnipi.services.donationService;

import com.barkachni.barkachnipi.entities.donationEntity.Donation;

import java.util.List;

public interface IDonationService {
    public List<Donation> retrieveAllDonation();
    public Donation retrieveDonation(int DonationId);
    public Donation addDonation(Donation d);
    public void removeDonation(int DonationId);
    public Donation modifyDonation(Donation donation);

}
