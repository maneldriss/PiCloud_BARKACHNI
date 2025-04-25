package com.barkachni.barkachni.Services.donationService;



import com.barkachni.barkachni.entities.donationEntity.Donation;
import com.barkachni.barkachni.entities.donationEntity.DonationStatus;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface IDonationService {
    public List<Donation> retrieveAllDonation();
    Optional<Donation> getDonationById(int id); // Modification ici
    public Donation retrieveDonation(int DonationId);
    public Donation addDonation(Donation d, Integer userId);
    public void removeDonation(int DonationId);
    public Donation modifyDonation(Donation donation);
    List<Donation> getDonationsByStatus(DonationStatus status);

    void recalculateUserPoints(int userId);
}
