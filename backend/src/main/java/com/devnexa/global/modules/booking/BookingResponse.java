package com.devnexa.global.modules.booking;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO for booking creation response returned to the client.
 */
public record BookingResponse(
        Long id,
        String bookingReference,
        String clientName,
        String clientEmail,
        Booking.MeetingType meetingType,
        LocalDate scheduledDate,
        String scheduledTime,
        Booking.Platform platform,
        Booking.BookingStatus status,
        LocalDateTime createdAt
) {
    public static BookingResponse from(Booking b) {
        return new BookingResponse(
                b.getId(),
                b.getBookingReference(),
                b.getClientName(),
                b.getClientEmail(),
                b.getMeetingType(),
                b.getScheduledDate(),
                b.getScheduledTime(),
                b.getPlatform(),
                b.getStatus(),
                b.getCreatedAt()
        );
    }
}
