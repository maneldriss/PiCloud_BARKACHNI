package com.barkachni.barkachni.entities.user;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.lastConnection = :lastConnection WHERE u.id = :userId")
    void updateLastConnection(@Param("userId") Integer userId,
                              @Param("lastConnection") LocalDateTime lastConnection);
    @Query("SELECT u FROM User u WHERE u.id IN :userIds")
    List<User> findAllByIds(@Param("userIds") List<Integer> userIds);
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.currentlyOnline = :status WHERE u.id = :userId")
    void updateCurrentlyOnlineStatus(@Param("userId") Integer userId, @Param("status") boolean status);
}
