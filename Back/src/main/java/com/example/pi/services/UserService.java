package com.example.pi.services;

import com.example.pi.entities.user;
import com.example.pi.repositories.IUserRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserService {


    @Autowired
    private IUserRepository userRepository;

    public user getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + userId));
    }
}
