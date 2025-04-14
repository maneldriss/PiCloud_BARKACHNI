package com.barkachni.barkachnipi.services.donationService;

import com.barkachni.barkachnipi.entities.userEntity.user;
import com.barkachni.barkachnipi.repositories.donationRepository.DonationRepository;
import com.barkachni.barkachnipi.repositories.userRepository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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
    }
}