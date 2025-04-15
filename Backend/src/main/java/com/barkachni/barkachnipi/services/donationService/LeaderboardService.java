package com.barkachni.barkachnipi.services.donationService;

import com.barkachni.barkachnipi.entities.userEntity.user;
import com.barkachni.barkachnipi.repositories.donationRepository.DonationRepository;
import com.barkachni.barkachnipi.repositories.userRepository.UserRepository;
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

   /* public Page<Map<String, Object>> getTopDonors(int page, int size) {
        Page<user> users = userRepository.findByOrderByDonationPointsDesc(
                PageRequest.of(page, size)
        );

        return users.map(user -> {
            Double totalApproved = donationRepository.sumApprovedDonationsByUser(user.getIdUser());

            Map<String, Object> donorData = new HashMap<>();
            donorData.put("email", user.getEmail());
            donorData.put("points", user.getDonationPoints()); // No null check needed for primitive int
            donorData.put("totalDonated", totalApproved != null ? totalApproved : 0.0);

            return donorData;
        });
    }*/
   public Page<Map<String, Object>> getTopDonors(int page, int size) {
       Pageable pageable = PageRequest.of(page, size);
       Page<Object[]> result = donationRepository.findTopMoneyDonors(pageable);

       return result.map(record -> {
           user donor = (user) record[0];
           Double totalDonated = (Double) record[1];

           Map<String, Object> data = new HashMap<>();
           data.put("email", donor.getEmail());
           data.put("points", donor.getDonationPoints()); // Assumes this is updated properly
           data.put("totalDonated", totalDonated);

           return data;
       });
   }

}