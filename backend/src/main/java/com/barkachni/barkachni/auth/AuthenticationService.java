package com.barkachni.barkachni.auth;

import com.barkachni.barkachni.email.EmailTemplateName;
import com.barkachni.barkachni.email.EmailService;
import com.barkachni.barkachni.entities.role.RoleRepository;
import com.barkachni.barkachni.entities.user.Token;
import com.barkachni.barkachni.entities.user.TokenRepository;
import com.barkachni.barkachni.entities.user.User;
import com.barkachni.barkachni.entities.user.UserRepository;
import com.barkachni.barkachni.security.JwtService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RoleRepository roleRepository;
    private final EmailService emailService;
    private final TokenRepository tokenRepository;

    @Value("${application.mailing.frontend.activation-url}")
    private String activationUrl;

    @Transactional
    public void register(RegistrationRequest request) throws MessagingException {
        var userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new IllegalStateException("ROLE USER was not initiated"));

        var user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .dateOfBirth(request.getDateOfBirth())
                .profilePicture(request.getProfilePictureUrl())
                .accountLocked(false)
                .enabled(false)
                .roles(List.of(userRole))
                .build();

        // Sauvegardez d'abord l'utilisateur
        user = userRepository.save(user);

        // Ensuite générez et sauvegardez le token
        sendValidationEmail(user);
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        var auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = (User) auth.getPrincipal();
        var claims = new HashMap<String, Object>();
        claims.put("fullName", user.getUsername());

        // Ajouter les rôles (on suppose que c'est une liste, on peut prendre le premier pour simplifier)
        claims.put("roles", user.getRoles().stream()
                .map(role -> role.getName().name()) // Convert RoleName enum to String
                .collect(Collectors.toList())
        );

        var jwtToken = jwtService.generateToken(claims, user);

        return AuthenticationResponse.builder()
                .user(user)
                .token(jwtToken)
                .build();
    }

    @Transactional
    public void activateAccount(String token) throws MessagingException {
        Token savedToken = tokenRepository.findByToken(token)
                // todo exception has to be defined
                .orElseThrow(() -> new RuntimeException("Invalid token"));
        if (LocalDateTime.now().isAfter(savedToken.getExpiresAt())) {
            sendValidationEmail(savedToken.getUser());
            throw new RuntimeException("Activation token has expired. A new token has been send to the same email address");
        }

        var user = userRepository.findById(savedToken.getUser().getId())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        user.setEnabled(true);
        userRepository.save(user);

        savedToken.setValidatedAt(LocalDateTime.now());
        tokenRepository.save(savedToken);
    }
  /* @Transactional
   public void activateAccount(String token) throws MessagingException {
       Token savedToken = tokenRepository.findByToken(token)
               .orElseThrow(() -> new RuntimeException("Invalid activation token"));

       if (savedToken.getValidatedAt() != null) {
           throw new RuntimeException("Token already used");
       }

       if (LocalDateTime.now().isAfter(savedToken.getExpiresAt())) {
           throw new RuntimeException("Activation token has expired");
       }

       var user = userRepository.findById(savedToken.getUser().getId())
               .orElseThrow(() -> new UsernameNotFoundException("User not found"));

       user.setEnabled(true);
       userRepository.save(user);

       savedToken.setValidatedAt(LocalDateTime.now());
       tokenRepository.save(savedToken);
   }*/
    private String generateAndSaveActivationToken(User user) {
        // Generate a token
        String generatedToken = generateActivationCode(6);
        var token = Token.builder()
                .token(generatedToken)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .user(user) // L'utilisateur doit déjà être persisté
                .build();

        tokenRepository.save(token);
        return generatedToken;
    }
    private void sendValidationEmail(User user) throws MessagingException {
        var newToken = generateAndSaveActivationToken(user);

        Map<String, Object> variables = new HashMap<>();
        variables.put("username", user.getUsername());
        variables.put("activationUrl", activationUrl + "?token=" + newToken); // Ajoutez le token à l'URL
        variables.put("activation_code", newToken); // Le nom doit correspondre au template

        emailService.sendEmail(
                user.getEmail(),
                "Account activation",
                EmailTemplateName.ACTIVATE_ACCOUNT.getName(),
                variables
        );
    }

    private String generateActivationCode(int length) {
        String characters = "0123456789";
        StringBuilder codeBuilder = new StringBuilder();

        SecureRandom secureRandom = new SecureRandom();

        for (int i = 0; i < length; i++) {
            int randomIndex = secureRandom.nextInt(characters.length());
            codeBuilder.append(characters.charAt(randomIndex));
        }

        return codeBuilder.toString();
    }


}