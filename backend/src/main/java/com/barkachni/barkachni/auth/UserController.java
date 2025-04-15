package com.barkachni.barkachni.auth;
//import ch.qos.logback.classic.Logger;
import com.barkachni.barkachni.Services.CloudinaryService;
import com.barkachni.barkachni.Services.UserService;
import com.barkachni.barkachni.entities.user.User;
import lombok.RequiredArgsConstructor;

import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor

//@CrossOrigin(origins = "http://localhost:4200")
public class UserController {
    private final UserService userService;
    private final CloudinaryService cloudinaryService;
    private static final Logger log = LoggerFactory.getLogger(UserController.class); // Initialisation correcte

    @GetMapping("/meu")
    public ResponseEntity<User> getCurrentUser(@AuthenticationPrincipal User user) {
        System.out.println(user);
        return ResponseEntity.ok(user);
    }
    @GetMapping("/Allusers")
    //@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        log.info("Attempting to fetch all users");
        try {
            List<User> users = userService.getAllUsers();
            log.info("Successfully fetched {} users", users.size());
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            log.error("Error fetching users", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @PutMapping("/me")
    public ResponseEntity<?> updateUser(
            @AuthenticationPrincipal User currentUser,
            @RequestBody User updatedUser) {

        // Vérification explicite de l'authentification
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User savedUser = userService.updateUser(currentUser.getId(), updatedUser);
        return ResponseEntity.ok(savedUser);
    }
    @PostMapping(value = "/me/profile-picture", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadProfilePicture(
            @AuthenticationPrincipal User currentUser,
            @RequestParam("file") MultipartFile file) {

        log.info("Attempting to upload profile picture for user: {}", currentUser); // Utilisation correcte du logger

        if (currentUser == null) {
            log.warn("Unauthorized upload attempt");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");

            //return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        }

        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }

        try {
            if (!file.getContentType().startsWith("image/")) {
                return ResponseEntity.badRequest().body("Only images are allowed");
            }

            String imageUrl = cloudinaryService.uploadImage(file);
            User updatedUser = new User();
            updatedUser.setPlofil_picture(imageUrl);
            userService.updateUser(currentUser.getId(), updatedUser);
            log.info("Successfully uploaded image for user {}: {}", currentUser.getId(), imageUrl);
            return ResponseEntity.ok(Collections.singletonMap("imageUrl", imageUrl));

        } catch (IOException e) {
            log.error("Upload failed for user {}: {}", currentUser.getId(), e.getMessage());
            return ResponseEntity.internalServerError().body("Upload failed: " + e.getMessage());
        }
    }
    @PatchMapping("/{userId}/status")
    //@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUserStatus(@PathVariable Integer userId,
                                              @RequestBody Map<String, Boolean> request) {
        try {
            Boolean enabled = request.get("enabled");
            if (enabled == null) {
                return ResponseEntity.badRequest().body("Enabled status is required");
            }

            User updatedUser = userService.updateUserStatus(userId, enabled);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            log.error("Error updating user status", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PatchMapping("/{userId}/lock")
    //@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateAccountLockStatus(@PathVariable Integer userId,
                                                     @RequestBody Map<String, Boolean> request) {
        try {
            Boolean locked = request.get("locked");
            if (locked == null) {
                return ResponseEntity.badRequest().body("Locked status is required");
            }

            User updatedUser = userService.updateAccountLockStatus(userId, locked);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            log.error("Error updating account lock status", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
