package com.devnexa.global.modules.booking;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Year;
import java.util.Arrays;
import java.util.List;

/**
 * Business logic for the booking module.
 */
@Service
public class BookingService {

    private static final Logger logger = LoggerFactory.getLogger(BookingService.class);

    /** Default time slots returned when no admin-configured slots exist for a date */
    private static final List<String[]> DEFAULT_TIMES = Arrays.asList(
            new String[]{"09:00", "10:00"},
            new String[]{"10:00", "11:00"},
            new String[]{"11:00", "12:00"},
            new String[]{"14:00", "15:00"},
            new String[]{"15:00", "16:00"},
            new String[]{"16:00", "17:00"},
            new String[]{"17:00", "18:00"}
    );

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private BookingSlotRepository bookingSlotRepository;

    // -------------------------------------------------------------------------
    // Public API
    // -------------------------------------------------------------------------

    /**
     * Returns available slots for the given date.
     * If admin-configured slots exist, they are returned (filtered to available ones).
     * Otherwise, a set of default synthetic slots is returned.
     */
    public List<BookingSlot> getAvailableSlots(LocalDate date) {
        List<BookingSlot> configured = bookingSlotRepository.findByDateAndIsAvailableTrue(date);
        if (!configured.isEmpty()) {
            return configured;
        }
        // Return synthetic default slots (not persisted)
        return DEFAULT_TIMES.stream()
                .map(t -> {
                    BookingSlot s = new BookingSlot(date, t[0], t[1]);
                    s.setId(null); // transient
                    return s;
                })
                .toList();
    }

    /**
     * Creates and persists a new booking from the request DTO.
     * Generates a human-readable booking reference like {@code DNX-2026-0001}.
     */
    @Transactional
    public Booking createBooking(BookingRequest dto) {
        Booking booking = new Booking();
        booking.setClientName(dto.clientName());
        booking.setClientEmail(dto.clientEmail());
        booking.setClientCompany(dto.clientCompany());
        booking.setPhone(dto.phone());
        booking.setMeetingType(dto.meetingType());
        booking.setScheduledDate(dto.scheduledDate());
        booking.setScheduledTime(dto.scheduledTime());
        booking.setTimezone(dto.timezone());
        booking.setPlatform(dto.platform());
        booking.setNotes(dto.notes());
        booking.setStatus(Booking.BookingStatus.PENDING);

        // Save first to obtain the generated ID
        booking = bookingRepository.save(booking);

        // Generate reference: DNX-<year>-<padded-id>
        String reference = "DNX-" + Year.now().getValue() + "-" + String.format("%04d", booking.getId());
        booking.setBookingReference(reference);
        booking = bookingRepository.save(booking);

        logger.info("New booking created: reference={}, client={}", reference, dto.clientEmail());
        return booking;
    }

    /**
     * Updates the status of an existing booking (admin operation).
     */
    @Transactional
    public Booking updateBookingStatus(Long id, Booking.BookingStatus status) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        booking.setStatus(status);
        return bookingRepository.save(booking);
    }

    /**
     * Returns all bookings (admin operation).
     */
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    /**
     * Creates an admin-configured slot.
     */
    @Transactional
    public BookingSlot createSlot(BookingSlot slot) {
        return bookingSlotRepository.save(slot);
    }

    /**
     * Deletes an admin-configured slot.
     */
    @Transactional
    public void deleteSlot(Long id) {
        bookingSlotRepository.deleteById(id);
    }
}
