package com.barkachni.barkachni.repositories.donationRepository;


import com.barkachni.barkachni.entities.donationEntity.Donation;
import com.barkachni.barkachni.entities.donationEntity.DonationStatus;
import com.barkachni.barkachni.entities.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DonationRepository extends JpaRepository<Donation, Integer> {
    List<Donation> findByStatus(DonationStatus status);
    @Query("SELECT d.donor, SUM(d.amount) as totalDonated " +
            "FROM Donation d " +
            "WHERE d.donationType = 'MONEY' " +
            "GROUP BY d.donor " +
            "ORDER BY totalDonated DESC")
    Page<Object[]> findTopDonors(Pageable pageable);
    @Query("SELECT COALESCE(SUM(d.amount), 0) FROM Donation d WHERE d.donor.id = :userId AND d.status = 'APPROVED' AND d.donationType = 'MONEY'")
    Double sumApprovedDonationsByUser(@Param("userId") Integer userId);

    List<Donation> findByDonorAndStatus(User donor, DonationStatus status);
    @Query("SELECT d FROM Donation d WHERE d.donor.id = :userId AND d.status = 'APPROVED'") // Utilisez idUser
    List<Donation> findApprovedDonationsByUser(@Param("userId") int userId);
    @Query("SELECT d.donor AS donor, SUM(d.amount) AS totalDonated " +
            "FROM Donation d " +
            "WHERE d.donationType = 'MONEY' AND d.status =' APPROVED' " +
            "GROUP BY d.donor " +
            "ORDER BY SUM(d.amount) DESC")
    Page<Object[]> findTopMoneyDonors(Pageable pageable);

}
