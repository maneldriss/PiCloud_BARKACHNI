package com.barkachni.barkachni.Services;
import ch.qos.logback.classic.Logger;
import com.barkachni.barkachni.auth.ConnectionTrackingService;
import com.barkachni.barkachni.entities.user.User;
import com.barkachni.barkachni.entities.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final ConnectionTrackingService connectionTrackingService;
    @Value("${app.upload.dir}")
    private String uploadDirectory;
    private Logger log;

    public User updateUser(Integer userId, User updatedUser) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        /*user.setFirstname(updatedUser.getFirstname());
        user.setLastname(updatedUser.getLastname());
        user.setBio(updatedUser.getBio());
        user.setDateOfBirth(updatedUser.getDateOfBirth());*/
        user.setPlofil_picture(updatedUser.getprofilePicture());

        return userRepository.save(user);
    }

    public User updateProfilePicture(Integer userId, MultipartFile file) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!file.isEmpty()) {
            String fileName = storeFile(file);
            user.setPlofil_picture("/uploads/" + fileName);
            return userRepository.save(user);
        }

        throw new RuntimeException("File is empty");
    }

    private String storeFile(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path uploadPath = Paths.get(uploadDirectory);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Files.copy(file.getInputStream(), uploadPath.resolve(fileName));
        return fileName;
    }
    public List<User> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<Integer> userIds = users.stream().map(User::getId).collect(Collectors.toList());

        Map<Integer, Boolean> onlineStatus = connectionTrackingService.getOnlineStatusForUsers(userIds);

        users.forEach(user -> {
            user.setCurrentlyOnline(onlineStatus.getOrDefault(user.getId(), false));
        });

        return users;
    }
    public User updateUserStatus(Integer userId, boolean enabled) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setEnabled(enabled);
        return userRepository.save(user);
    }

    public User updateAccountLockStatus(Integer userId, boolean locked) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setAccountLocked(locked);
        return userRepository.save(user);
    }
    public User getUserWithConnectionStatus(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setCurrentlyOnline(connectionTrackingService.isUserOnline(userId));
        return user;
    }
}
