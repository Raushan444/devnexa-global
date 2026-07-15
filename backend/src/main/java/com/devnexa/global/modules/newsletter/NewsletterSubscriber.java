package com.devnexa.global.modules.newsletter;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Represents a newsletter subscriber.
 * Schema is future-ready for double opt-in and external provider sync.
 */
@Entity
@Table(name = "newsletter_subscribers")
public class NewsletterSubscriber {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubscriberStatus status = SubscriberStatus.PENDING;

    /** UUID token for double opt-in confirmation (future use) */
    private String confirmationToken;

    /** Future: "mailchimp", "brevo", "sendgrid" */
    private String externalProvider;

    /** External service subscriber ID (future use) */
    private String externalId;

    private LocalDateTime subscribedAt;
    private LocalDateTime confirmedAt;

    @PrePersist
    protected void onCreate() {
        if (this.subscribedAt == null) {
            this.subscribedAt = LocalDateTime.now();
        }
    }

    // -------------------------------------------------------------------------
    // Enum
    // -------------------------------------------------------------------------

    public enum SubscriberStatus {
        PENDING, CONFIRMED, UNSUBSCRIBED
    }

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    public NewsletterSubscriber() {}

    // -------------------------------------------------------------------------
    // Getters & Setters
    // -------------------------------------------------------------------------

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public SubscriberStatus getStatus() { return status; }
    public void setStatus(SubscriberStatus status) { this.status = status; }

    public String getConfirmationToken() { return confirmationToken; }
    public void setConfirmationToken(String confirmationToken) { this.confirmationToken = confirmationToken; }

    public String getExternalProvider() { return externalProvider; }
    public void setExternalProvider(String externalProvider) { this.externalProvider = externalProvider; }

    public String getExternalId() { return externalId; }
    public void setExternalId(String externalId) { this.externalId = externalId; }

    public LocalDateTime getSubscribedAt() { return subscribedAt; }
    public void setSubscribedAt(LocalDateTime subscribedAt) { this.subscribedAt = subscribedAt; }

    public LocalDateTime getConfirmedAt() { return confirmedAt; }
    public void setConfirmedAt(LocalDateTime confirmedAt) { this.confirmedAt = confirmedAt; }
}
