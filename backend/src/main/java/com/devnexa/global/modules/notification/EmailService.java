package com.devnexa.global.modules.notification;

import com.devnexa.global.modules.auth.User;
import com.devnexa.global.modules.payment.Invoice;
import com.devnexa.global.modules.portal.SupportTicket;
import com.devnexa.global.modules.public_shared.Appointment;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Autowired
    @Lazy
    private MessagePublisher messagePublisher;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    public void sendWelcomeEmail(User user) {
        String subject = "Welcome to DevNexa Global!";
        String body = "<h1>Welcome, " + user.getUsername() + "!</h1>"
                + "<p>Thank you for choosing DevNexa Global as your digital partner. We are excited to build scalable solutions together.</p>"
                + "<p>Log in to your client portal to track active projects, invoices, and support tasks.</p>"
                + "<br/><p>Best regards,<br/>The DevNexa Global Team</p>";
        messagePublisher.publishEmail(new EmailMessage(user.getEmail(), subject, body, true));
    }

    public void sendOtpEmail(String email, String otp) {
        String subject = "Your DevNexa Verification Code";
        String body = "<p>Your one-time passcode (OTP) for verification is: </p>"
                + "<h2 style='color:#00E5FF;'>" + otp + "</h2>"
                + "<p>This code will expire in 10 minutes. If you did not request this code, please ignore this email.</p>";
        messagePublisher.publishEmail(new EmailMessage(email, subject, body, true));
    }

    public void sendAppointmentConfirmation(Appointment appointment) {
        String subject = "Consultation Scheduled - DevNexa Global";
        String body = "<h3>Dear " + appointment.getName() + ",</h3>"
                + "<p>Your appointment has been successfully scheduled.</p>"
                + "<p><b>Details:</b></p>"
                + "<ul>"
                + "<li>Type: " + appointment.getMeetingType() + "</li>"
                + "<li>Time: " + appointment.getScheduledTime().toString() + "</li>"
                + "</ul>"
                + "<p>Our engineers will connect with you via Google Meet. A calendar invite has been sent.</p>";
        messagePublisher.publishEmail(new EmailMessage(appointment.getEmail(), subject, body, true));
    }

    public void sendTicketNotification(SupportTicket ticket, String message) {
        String subject = "Support Ticket Update: #" + ticket.getId();
        String body = "<p>Your support ticket has a new update.</p>"
                + "<p><b>Subject:</b> " + ticket.getSubject() + "</p>"
                + "<p><b>Latest Message:</b> " + message + "</p>"
                + "<p>Log into your portal dashboard to reply.</p>";
        messagePublisher.publishEmail(new EmailMessage(ticket.getClient().getEmail(), subject, body, true));
    }

    public void sendInvoiceEmail(Invoice invoice, User client) {
        String subject = "Invoice Due: " + invoice.getInvoiceNumber();
        String body = "<h3>Dear " + client.getUsername() + ",</h3>"
                + "<p>A new invoice has been generated for your project: <b>" + invoice.getProject().getTitle() + "</b>.</p>"
                + "<p><b>Invoice Number:</b> " + invoice.getInvoiceNumber() + "<br/>"
                + "<b>Amount Due:</b> $" + invoice.getAmount() + "<br/>"
                + "<b>Due Date:</b> " + invoice.getDueDate().toString() + "</p>"
                + "<p>You can pay directly via Stripe or Razorpay in your portal dashboard.</p>";
        messagePublisher.publishEmail(new EmailMessage(client.getEmail(), subject, body, true));
    }

    public void sendDirectEmail(String to, String subject, String body, boolean isHtml) {
        if (mailSender == null || fromEmail == null || fromEmail.isEmpty()) {
            logger.warn("SMTP Mail Sender is not configured. Mocking email send to {}. Subject: {}", to, subject);
            return;
        }

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
            helper.setText(body, isHtml);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setFrom(fromEmail);
            mailSender.send(mimeMessage);
            logger.info("Email successfully sent to {}", to);
        } catch (Exception e) {
            logger.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }
}
