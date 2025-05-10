package com.example.pi.controllers;

import com.example.pi.entities.Product;
import com.example.pi.entities.user;
import com.example.pi.services.ProductService;
import com.example.pi.services.UserService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class UserRestController {
    @Autowired
    UserService userService;

    @GetMapping("/retrieve-user/{id}")
    public user getuserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }
}
