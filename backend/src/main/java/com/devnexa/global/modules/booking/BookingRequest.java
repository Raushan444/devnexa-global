package com.devnexa.global.modules.booking;

import java.time.LocalDate;

/**
 * DTO for creating a new booking (inbound from the public API).
 */
public record BookingRequest(
        String clientName,
        String clientEmail,
        String clientCompany,
        String phone,
        Booking.MeetingType meetingType,
        LocalDate scheduledDate,
        String scheduledTime,
        String timezone,
        Booking.Platform platform,
        String notes
) {}
