package com.barkachni.barkachni.Services.donationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;

@Service("emailServiceDonation")
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}") // 1. Injection depuis application.properties
    private String fromEmail;

    // 2. Injection par constructeur
    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendDonationStatusEmail(String toEmail, String donationType, String status) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(fromEmail); // 3. Utilisation de la variable injectée
            helper.setTo(toEmail);
            helper.setSubject("Statut de votre donation");

            String content = buildEmailContent(donationType, status);
            helper.setText(content, true);

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Échec de l'envoi d'email", e);
        }
    }

    private String buildEmailContent(String donationType, String status) {
        String statusText = status.equals("APPROVED") ? "approuvée" : "rejetée";
        String color = status.equals("APPROVED") ? "#4CAF50" : "#F44336";

        return String.format("""
            <!DOCTYPE html>
            <html>
            <head><style>body{font-family:Arial,sans-serif;}</style></head>
            <body>
                <h2 style='color:%s'>Statut de donation</h2>
                <p>Votre donation de type <strong>%s</strong> a été <strong style='color:%s'>%s</strong></p>
            </body>
            </html>
            """, color, donationType, color, statusText);
    }
}