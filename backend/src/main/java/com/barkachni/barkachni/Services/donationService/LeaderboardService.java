package com.barkachni.barkachni.Services.donationService;


import com.barkachni.barkachni.entities.user.User;
import com.barkachni.barkachni.entities.user.UserRepository;
import com.barkachni.barkachni.repositories.donationRepository.DonationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class LeaderboardService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private DonationRepository donationRepository;


    public Page<Map<String, Object>> getTopDonors(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Object[]> result = donationRepository.findTopMoneyDonors(pageable);

        return result.map(record -> {
            User donor = (User) record[0]; // Le donateur est à l'index 0
            Double totalDonated = (Double) record[1]; // Le montant total est à l'index 1

            Map<String, Object> data = new HashMap<>();
            data.put("email", donor.getEmail());
            data.put("points", donor.getDonationPoints()); // Assurez-vous que les points sont bien mis à jour
            data.put("totalDonated", totalDonated);

            return data;
        });
    }


}