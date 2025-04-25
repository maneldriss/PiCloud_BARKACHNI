package com.barkachni.barkachni.auth;

import com.barkachni.barkachni.entities.user.User;
import com.barkachni.barkachni.entities.user.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class ConnectionTrackingService {
    private final Map<Integer, LocalDateTime> activeConnections = new ConcurrentHashMap<>();
    private final UserRepository userRepository;

    public ConnectionTrackingService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void userConnected(Integer userId) {
        activeConnections.put(userId, LocalDateTime.now());
    }

    public void userDisconnected(Integer userId) {
        activeConnections.remove(userId);
        userRepository.updateCurrentlyOnlineStatus(userId, false);
    }

    public boolean isUserOnline(Integer userId) {
        return activeConnections.containsKey(userId);
    }

    public LocalDateTime getLastConnection(Integer userId) {
        return activeConnections.getOrDefault(userId,
                userRepository.findById(userId)
                        .map(User::getLastConnection)
                        .orElse(null));
    }

    public Map<Integer, Boolean> getOnlineStatusForUsers(List<Integer> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            return Collections.emptyMap();
        }

        return userIds.stream()
                .collect(Collectors.toMap(
                        id -> id,
                        this::isUserOnline
                ));
    }
}