package com.barkachni.barkachni.Services;

import com.barkachni.barkachni.auth.AuthenticationRequest;
import com.barkachni.barkachni.auth.AuthenticationResponse;
import com.barkachni.barkachni.auth.ConnectionTrackingService;
import com.barkachni.barkachni.auth.RegistrationRequest;
import com.barkachni.barkachni.email.EmailTemplateName;
import com.barkachni.barkachni.email.EmailService;
import com.barkachni.barkachni.entities.Dressing.Dressing;
import com.barkachni.barkachni.entities.Dressing.Outfit;
import com.barkachni.barkachni.entities.role.RoleName;
import com.barkachni.barkachni.entities.role.RoleRepository;
import com.barkachni.barkachni.entities.user.Token;
import com.barkachni.barkachni.entities.user.TokenRepository;
import com.barkachni.barkachni.entities.user.User;
import com.barkachni.barkachni.entities.user.UserRepository;
import com.barkachni.barkachni.repositories.cart.ICartRepository;
import com.barkachni.barkachni.security.JwtService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.barkachni.barkachni.entities.cart.cart;
import org.springframework.transaction.annotation.Transactional;
import com.barkachni.barkachni.repositories.Dressing.DressingRepository;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    @Autowired
    private ICartRepository cartRepository;

    private final DressingRepository dressingRepository;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RoleRepository roleRepository;
    private final EmailService emailService;
    private final TokenRepository tokenRepository;
    private final ConnectionTrackingService connectionTrackingService;


    @Value("${application.mailing.frontend.activation-url}")
    private String activationUrl;

    @Transactional
    public void register(RegistrationRequest request) throws MessagingException {
        var userRole = roleRepository.findByName(RoleName.USER)
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
        cart cart = new cart();
        cart.setUser(user); // Associate cart with the user
       cartRepository.save(cart);

        Dressing dressing = new Dressing();
        dressing.setName(user.getFirstname()+"'s dressing");
        dressing.setUser(user);

        dressingRepository.save(dressing);

        // Ensuite générez et sauvegardez le token
        sendValidationEmail(user);
    }

    @Transactional
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        var auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = (User) auth.getPrincipal();
        if (user.getDressing() !=null && user.getDressing().getOutfits() !=null) {
            Hibernate.initialize(user.getDressing().getOutfits());
            for (Outfit outfit : user.getDressing().getOutfits()){
                Hibernate.initialize(outfit.getItems());
            }
        }

        // Update connection status
        connectionTrackingService.userConnected(user.getId());
        user.setLastConnection(LocalDateTime.now());
        userRepository.save(user);

        var claims = new HashMap<String, Object>();
        claims.put("fullName", user.getUsername());
        claims.put("roles", user.getRoles().stream()
                .map(role -> role.getName().name())
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