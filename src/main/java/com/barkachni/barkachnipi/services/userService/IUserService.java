package com.barkachni.barkachnipi.services.userService;

import com.barkachni.barkachnipi.entities.userEntity.User;

import java.util.List;

public interface IUserService {
    public List<User> retrieveAllUsers();
    public User retrieveUser(long userId);
}
