package com.devnexa.global.modules.notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class MessageListener {

    private static final Logger logger = LoggerFactory.getLogger(MessageListener.class);

    @Autowired
    private EmailService emailService;

    @RabbitListener(queues = RabbitMQConfig.EMAIL_QUEUE)
    public void receiveEmail(EmailMessage message) {
        logger.info("Received email task from RabbitMQ queue for: {}", message.getTo());
        try {
            emailService.sendDirectEmail(
                    message.getTo(),
                    message.getSubject(),
                    message.getBody(),
                    message.isHtml()
            );
        } catch (Exception e) {
            logger.error("Error processing email queue message: {}", e.getMessage());
            throw e; // Triggers dead letter queue routing if configured
        }
    }
}
