package com.barkachni.barkachni.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender javaMailSender;
    private final SpringTemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String senderEmail;

    @Async
    public void sendEmail(String to, String subject, String templateName,
                          Map<String, Object> variables) throws MessagingException {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(new InternetAddress(senderEmail, "BarkachniSupport"));
            helper.setTo(to);
            helper.setSubject(subject);

            Context context = new Context();
            context.setVariables(variables);
            String html = templateEngine.process(templateName, context);

            helper.setText(html, true);
            javaMailSender.send(message);

        } catch (Exception e) {
            log.error("Échec d'envoi à {}", to, e);
            throw new MessagingException("Échec d'envoi d'email", e);
        }
    }
    @Async
    public void sendPasswordResetEmail(String to, String username, String resetLink) throws MessagingException {
        try {
            Map<String, Object> properties = new HashMap<>();
            properties.put("username", username);
            properties.put("resetLink", resetLink);
            properties.put("expirationHours", 24);

            Context context = new Context();
            context.setVariables(properties);

            String htmlContent = templateEngine.process(
                    EmailTemplateName.RESET_PASSWORD.getName(),
                    context
            );

            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setFrom(senderEmail);
            helper.setTo(to);
            helper.setSubject("Réinitialisation de votre mot de passe");
            helper.setText(htmlContent, true);

            javaMailSender.send(mimeMessage);

        } catch (Exception ex) {
            log.error("Error sending password reset email", ex);
            throw new MessagingException("Failed to send password reset email", ex);
        }
    }
}