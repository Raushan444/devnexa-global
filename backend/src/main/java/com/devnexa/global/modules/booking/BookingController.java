package com.devnexa.global.modules.booking;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * REST controller for the booking module.
 * Public endpoints are under /api/public/booking/**
 * Admin endpoints are under /api/admin/booking/**  and  /api/admin/bookings/**
 */
@RestController
@RequestMapping("/api")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // -------------------------------------------------------------------------
    // Public endpoints
    // -------------------------------------------------------------------------

    /**
     * GET /api/public/booking/slots?date=2026-08-01
     * Returns available booking slots for the given date.
     */
    @GetMapping("/public/booking/slots")
    public ResponseEntity<List<BookingSlot>> getAvailableSlots(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(bookingService.getAvailableSlots(date));
    }

    /**
     * POST /api/public/booking
     * Creates a new booking and returns the reference number.
     */
    @PostMapping("/public/booking")
    public ResponseEntity<BookingResponse> createBooking(@RequestBody BookingRequest request) {
        Booking booking = bookingService.createBooking(request);
        return ResponseEntity.ok(BookingResponse.from(booking));
    }

    // -------------------------------------------------------------------------
    // Admin endpoints
    // -------------------------------------------------------------------------

    /**
     * GET /api/admin/bookings
     * Returns all bookings (admin only).
     */
    @GetMapping("/admin/bookings")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    /**
     * PUT /api/admin/bookings/{id}/status
     * Updates the status of a booking (admin only).
     * Body: { "status": "CONFIRMED" }
     */
    @PutMapping("/admin/bookings/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Booking> updateBookingStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        Booking.BookingStatus status = Booking.BookingStatus.valueOf(body.get("status").toUpperCase());
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, status));
    }

    /**
     * POST /api/admin/booking/slots
     * Creates a new admin-configured slot.
     */
    @PostMapping("/admin/booking/slots")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<BookingSlot> createSlot(@RequestBody BookingSlot slot) {
        return ResponseEntity.ok(bookingService.createSlot(slot));
    }

    /**
     * DELETE /api/admin/booking/slots/{id}
     * Deletes an admin-configured slot.
     */
    @DeleteMapping("/admin/booking/slots/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteSlot(@PathVariable Long id) {
        bookingService.deleteSlot(id);
        return ResponseEntity.noContent().build();
    }
}
