package com.barkachni.barkachni.auth;

import com.barkachni.barkachni.Services.AuthenticationService;
import com.barkachni.barkachni.Services.CloudinaryService;
import com.barkachni.barkachni.entities.user.User;
import com.barkachni.barkachni.entities.user.UserRepository;
import com.barkachni.barkachni.security.JwtService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Authentication")
public class AuthenticationController {
    private final CloudinaryService cloudinaryService;
    private final AuthenticationService service;
    private final ConnectionTrackingService connectionTrackingService;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<?> register(
            @RequestBody @Valid RegistrationRequest request
    ) {
        try {
            service.register(request);
            return ResponseEntity.accepted().build();
        } catch (MessagingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to send activation email");
        }
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request
    ) {


        AuthenticationResponse response = service.authenticate(request);
        // Track user connection
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        connectionTrackingService.userConnected(user.getId());
        userRepository.updateLastConnection(user.getId(), LocalDateTime.now());
        return ResponseEntity.ok(response);
    }
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        try {
            String token = extractJwtFromRequest(request);
            if (token != null) {
                String username = jwtService.extractUsername(token);
                User user = userRepository.findByEmail(username)
                        .orElseThrow(() -> new RuntimeException("User not found"));

                connectionTrackingService.userDisconnected(user.getId());
                userRepository.updateLastConnection(user.getId(), LocalDateTime.now());
                userRepository.updateCurrentlyOnlineStatus(user.getId(), false);
            }
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error during logout", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private String extractJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
    @PostMapping("/activate-account")
    public ResponseEntity<Map<String, String>> activateAccount(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            service.activateAccount(token);

            return ResponseEntity.ok()
                    .body(Map.of(
                            "status", "success",
                            "message", "Account activated successfully"
                    ));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "status", "error",
                            "message", e.getMessage()
                    ));
        }
    }
    @GetMapping("/oauth2/authorization/google")
    public void initiateGoogleOAuth2(HttpServletResponse response) throws IOException {
        response.sendRedirect("/oauth2/authorization/google");
    }
}