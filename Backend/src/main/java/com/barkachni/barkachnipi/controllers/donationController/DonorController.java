package com.barkachni.barkachnipi.controllers.donationController;

import com.barkachni.barkachnipi.services.donationService.LeaderboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/donors")
public class DonorController {

    @Autowired
    private LeaderboardService leaderboardService;

    @GetMapping("/leaderboard")
    public Page<Map<String, Object>> getTopDonors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return leaderboardService.getTopDonors(page, size);
    }

}