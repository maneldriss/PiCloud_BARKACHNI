package com.barkachni.barkachni.email;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {

    private final SendGrid sendGrid;
    private final SpringTemplateEngine templateEngine;

    @Value("${sendgrid.sender-email}")
    private String senderEmail;

    @Async
    public void sendEmail(
            String to,
            String username,
            EmailTemplateName emailTemplate,
            String confirmationUrl,
            String activationCode,
            String subject
    ) throws MessagingException {
        try {
            String templateName = emailTemplate != null ? emailTemplate.getName() : "confirm-email";

            Map<String, Object> properties = new HashMap<>();
            properties.put("username", username);
            properties.put("confirmationUrl", confirmationUrl);
            properties.put("activation_code", activationCode);

            Context context = new Context();
            context.setVariables(properties);

            String htmlContent = templateEngine.process(templateName, context);

            Email from = new Email(senderEmail);
            Email toEmail = new Email(to);
            Content content = new Content("text/html", htmlContent);

            Mail mail = new Mail(from, subject, toEmail, content);

            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sendGrid.api(request);

            if (response.getStatusCode() >= 400) {
                log.error("SendGrid error: {} - {}", response.getStatusCode(), response.getBody());
                throw new MessagingException("Failed to send email via SendGrid");
            }

        } catch (IOException ex) {
            log.error("Error sending email with SendGrid", ex);
            throw new MessagingException("Error sending email", ex);
        }
    }
}