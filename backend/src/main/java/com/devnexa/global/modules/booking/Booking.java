package com.devnexa.global.modules.booking;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Represents a client booking / consultation request.
 */
@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String clientName;

    @Column(nullable = false)
    private String clientEmail;

    private String clientCompany;
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MeetingType meetingType;

    @Column(nullable = false)
    private LocalDate scheduledDate;

    /** e.g. "14:00" */
    @Column(nullable = false)
    private String scheduledTime;

    /** e.g. "Asia/Kolkata" */
    private String timezone;

    @Enumerated(EnumType.STRING)
    private Platform platform;

    /** Admin fills this in after confirming the booking */
    private String meetLink;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.PENDING;

    /** Auto-generated reference, e.g. "DNX-2026-0001" */
    @Column(unique = true)
    private String bookingReference;

    /** Reserved for future Google Calendar sync */
    private String externalCalendarEventId;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // -------------------------------------------------------------------------
    // Enums
    // -------------------------------------------------------------------------

    public enum MeetingType {
        STRATEGY_CALL, TECHNICAL_AUDIT, PARTNERSHIP, SUPPORT
    }

    public enum Platform {
        GOOGLE_MEET, ZOOM, TEAMS, PHONE
    }

    public enum BookingStatus {
        PENDING, CONFIRMED, COMPLETED, CANCELLED
    }

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    public Booking() {}

    // -------------------------------------------------------------------------
    // Getters & Setters
    // -------------------------------------------------------------------------

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getClientName() { return clientName; }
    public void setClientName(String clientName) { this.clientName = clientName; }

    public String getClientEmail() { return clientEmail; }
    public void setClientEmail(String clientEmail) { this.clientEmail = clientEmail; }

    public String getClientCompany() { return clientCompany; }
    public void setClientCompany(String clientCompany) { this.clientCompany = clientCompany; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public MeetingType getMeetingType() { return meetingType; }
    public void setMeetingType(MeetingType meetingType) { this.meetingType = meetingType; }

    public LocalDate getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(LocalDate scheduledDate) { this.scheduledDate = scheduledDate; }

    public String getScheduledTime() { return scheduledTime; }
    public void setScheduledTime(String scheduledTime) { this.scheduledTime = scheduledTime; }

    public String getTimezone() { return timezone; }
    public void setTimezone(String timezone) { this.timezone = timezone; }

    public Platform getPlatform() { return platform; }
    public void setPlatform(Platform platform) { this.platform = platform; }

    public String getMeetLink() { return meetLink; }
    public void setMeetLink(String meetLink) { this.meetLink = meetLink; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }

    public String getBookingReference() { return bookingReference; }
    public void setBookingReference(String bookingReference) { this.bookingReference = bookingReference; }

    public String getExternalCalendarEventId() { return externalCalendarEventId; }
    public void setExternalCalendarEventId(String externalCalendarEventId) { this.externalCalendarEventId = externalCalendarEventId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
