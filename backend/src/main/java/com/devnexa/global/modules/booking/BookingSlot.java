package com.devnexa.global.modules.booking;

import jakarta.persistence.*;
import java.time.LocalDate;

/**
 * Represents an admin-configured time slot available for booking.
 * If no slots are configured for a given date, the service returns a default set.
 */
@Entity
@Table(name = "booking_slots")
public class BookingSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate date;

    /** e.g. "09:00" */
    @Column(nullable = false)
    private String startTime;

    /** e.g. "10:00" */
    @Column(nullable = false)
    private String endTime;

    @Column(nullable = false)
    private boolean isAvailable = true;

    /** Maximum number of bookings allowed in this slot (default 1) */
    @Column(nullable = false)
    private int maxBookings = 1;

    /** Tracks how many bookings have been made for this slot */
    @Column(nullable = false)
    private int currentBookings = 0;

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    public BookingSlot() {}

    public BookingSlot(LocalDate date, String startTime, String endTime) {
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.isAvailable = true;
        this.maxBookings = 1;
        this.currentBookings = 0;
    }

    // -------------------------------------------------------------------------
    // Getters & Setters
    // -------------------------------------------------------------------------

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }

    public boolean isAvailable() { return isAvailable; }
    public void setAvailable(boolean available) { isAvailable = available; }

    public int getMaxBookings() { return maxBookings; }
    public void setMaxBookings(int maxBookings) { this.maxBookings = maxBookings; }

    public int getCurrentBookings() { return currentBookings; }
    public void setCurrentBookings(int currentBookings) { this.currentBookings = currentBookings; }
}
