package com.barkachni.barkachnipi.controllers.userController;

import com.barkachni.barkachnipi.entities.userEntity.User;
import com.barkachni.barkachnipi.services.userService.IUserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name="Gestion User")
@RestController
@AllArgsConstructor
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:4200")
public class UserRestController {
    @Autowired
    IUserService userService;


    @GetMapping("/retrieve-all-users")
    public List<User> getUsers() {
        List<User> listUsers = userService.retrieveAllUsers();
        return listUsers;
    }

}
