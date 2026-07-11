package com.devnexa.global.modules.notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class MessagePublisher {

    private static final Logger logger = LoggerFactory.getLogger(MessagePublisher.class);

    @Autowired(required = false)
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private EmailService emailService;

    public void publishEmail(EmailMessage message) {
        if (rabbitTemplate != null) {
            try {
                rabbitTemplate.convertAndSend(
                        RabbitMQConfig.DEV_EXCHANGE,
                        RabbitMQConfig.EMAIL_ROUTING_KEY,
                        message
                );
                logger.info("Email task published to RabbitMQ queue for: {}", message.getTo());
                return;
            } catch (Exception e) {
                logger.warn("Failed to publish to RabbitMQ. Falling back to direct email sending: {}", e.getMessage());
            }
        }
        // Fallback to sending direct synchronously
        emailService.sendDirectEmail(message.getTo(), message.getSubject(), message.getBody(), message.isHtml());
    }
}
