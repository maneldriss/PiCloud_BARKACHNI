package com.barkachni.barkachni.PasswordReset;

import com.barkachni.barkachni.PasswordReset.DTOs.ForgotPasswordRequest;
import com.barkachni.barkachni.PasswordReset.DTOs.ResetPasswordRequest;
import com.barkachni.barkachni.email.EmailService;
import com.barkachni.barkachni.entities.user.PasswordResetToken;
import com.barkachni.barkachni.entities.user.PasswordResetTokenRepository;
import com.barkachni.barkachni.entities.user.User;
import com.barkachni.barkachni.entities.user.UserRepository;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetService {
    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) throws MessagingException {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken(token, user);
        tokenRepository.save(resetToken);

        String resetLink = "http://localhost:4200/reset-password?token=" + token;
        emailService.sendPasswordResetEmail(
                user.getEmail(),
                user.getUsername(),
                resetLink
        );
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        // Verify passwords match
        if (!request.newPassword().equals(request.confirmPassword())) {
            throw new RuntimeException("Passwords don't match");
        }

        // Find and validate token
        PasswordResetToken resetToken = tokenRepository.findByToken(request.token())
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (isTokenExpired(resetToken)) {
            throw new RuntimeException("Token has expired");
        }

        // Update user password
        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

        // Delete the used token
        tokenRepository.delete(resetToken);
    }

    private boolean isTokenExpired(PasswordResetToken passToken) {
        return passToken.getExpiryDate().before(new Date());
    }
}