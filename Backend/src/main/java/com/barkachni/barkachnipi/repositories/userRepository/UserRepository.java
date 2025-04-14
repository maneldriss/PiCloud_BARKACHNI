package com.barkachni.barkachnipi.repositories.userRepository;

import com.barkachni.barkachnipi.entities.userEntity.user;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository

public interface UserRepository extends JpaRepository<user, Long> {
    @Query("SELECT d.donor AS user, SUM(d.amount) AS totalDonated " +
            "FROM Donation d GROUP BY d.donor ORDER BY totalDonated DESC")
    List<Object[]> findTopDonors();
    Page<user> findAllByOrderByDonationPointsDesc(Pageable pageable);
    Page<user> findByOrderByDonationPointsDesc(Pageable pageable);


}
