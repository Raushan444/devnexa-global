package com.devnexa.global.modules.newsletter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Business logic for the newsletter subscriber module.
 */
@Service
public class NewsletterService {

    private static final Logger logger = LoggerFactory.getLogger(NewsletterService.class);

    @Autowired
    private NewsletterRepository newsletterRepository;

    // -------------------------------------------------------------------------
    // Public operations
    // -------------------------------------------------------------------------

    /**
     * Subscribes an email to the newsletter.
     * <p>
     * If the email is already subscribed and CONFIRMED, returns the existing subscriber.
     * If previously UNSUBSCRIBED, re-activates the subscription as CONFIRMED.
     * New subscribers are saved directly as CONFIRMED (double opt-in is schema-ready
     * but skipped for now — {@code confirmationToken} is still generated for future use).
     * </p>
     *
     * @param email subscriber email address
     * @param name  subscriber display name (optional)
     * @return the saved {@link NewsletterSubscriber}
     */
    @Transactional
    public NewsletterSubscriber subscribe(String email, String name) {
        Optional<NewsletterSubscriber> existing = newsletterRepository.findByEmail(email);

        if (existing.isPresent()) {
            NewsletterSubscriber sub = existing.get();
            if (sub.getStatus() == NewsletterSubscriber.SubscriberStatus.CONFIRMED) {
                logger.info("Email already subscribed: {}", email);
                return sub; // idempotent
            }
            // Re-activate an unsubscribed address
            sub.setStatus(NewsletterSubscriber.SubscriberStatus.CONFIRMED);
            sub.setConfirmedAt(LocalDateTime.now());
            if (name != null && !name.isBlank()) sub.setName(name);
            logger.info("Re-subscribed email: {}", email);
            return newsletterRepository.save(sub);
        }

        NewsletterSubscriber subscriber = new NewsletterSubscriber();
        subscriber.setEmail(email);
        subscriber.setName(name);
        subscriber.setStatus(NewsletterSubscriber.SubscriberStatus.CONFIRMED);
        subscriber.setConfirmationToken(UUID.randomUUID().toString());
        subscriber.setConfirmedAt(LocalDateTime.now());

        NewsletterSubscriber saved = newsletterRepository.save(subscriber);
        logger.info("New subscriber: email={}", email);
        return saved;
    }

    /**
     * Sets a subscriber's status to UNSUBSCRIBED by email.
     */
    @Transactional
    public void unsubscribe(String email) {
        newsletterRepository.findByEmail(email).ifPresent(sub -> {
            sub.setStatus(NewsletterSubscriber.SubscriberStatus.UNSUBSCRIBED);
            newsletterRepository.save(sub);
            logger.info("Unsubscribed email: {}", email);
        });
    }

    // -------------------------------------------------------------------------
    // Admin operations
    // -------------------------------------------------------------------------

    /**
     * Returns all subscribers (admin).
     */
    public List<NewsletterSubscriber> getAllSubscribers() {
        return newsletterRepository.findAll();
    }

    /**
     * Exports all CONFIRMED subscribers as a CSV string.
     *
     * @return CSV with header row
     */
    public String exportCsv() {
        List<NewsletterSubscriber> confirmed =
                newsletterRepository.findByStatus(NewsletterSubscriber.SubscriberStatus.CONFIRMED);

        StringBuilder csv = new StringBuilder("id,name,email,status,subscribedAt,confirmedAt\n");
        for (NewsletterSubscriber s : confirmed) {
            csv.append(s.getId()).append(",")
               .append(escapeCsv(s.getName())).append(",")
               .append(escapeCsv(s.getEmail())).append(",")
               .append(s.getStatus()).append(",")
               .append(s.getSubscribedAt()).append(",")
               .append(s.getConfirmedAt()).append("\n");
        }
        return csv.toString();
    }

    /**
     * Deletes a subscriber by ID (admin).
     */
    @Transactional
    public void deleteSubscriber(Long id) {
        newsletterRepository.deleteById(id);
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    private String escapeCsv(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }
}
