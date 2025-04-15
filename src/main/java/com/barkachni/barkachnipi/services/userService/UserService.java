package com.barkachni.barkachnipi.services.userService;

import com.barkachni.barkachnipi.entities.userEntity.User;
import com.barkachni.barkachnipi.repositories.userRepository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class UserService implements IUserService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public List<User> retrieveAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User retrieveUser(long userId) {
        return userRepository.findById(userId).get();    }
    }

