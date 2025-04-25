package com.barkachni.barkachni.Services.blog;


import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import org.slf4j.LoggerFactory;
import org.slf4j.Logger;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service("emailServiceBlog")
public class EmailService {
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendCommentNotification(String toEmail, String postTitle, String commentContent, String commenterName, LocalDateTime commentDate) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMMM yyyy à HH:mm");

            String formattedDate = commentDate.format(formatter);
            String subject = "💬 Nouveau commentaire sur votre post : " + postTitle;

            String text = "👤 Commenté par : " + commenterName + "\n"
                    + "📅 Date : " + formattedDate + "\n\n"
                    + "💬 Contenu du commentaire :\n"
                    + commentContent
                    + "\n\n🔗 Connectez-vous pour voir plus de détails.";

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("webuild2026@gmail.com");
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(text);

            mailSender.send(message);
            logger.info("Email envoyé avec succès à {}", toEmail);
        } catch (MailException e) {
            logger.error("Échec d'envoi d'email à {}", toEmail, e);
            throw new RuntimeException("Échec d'envoi de notification par email", e);
        }
    }
}
