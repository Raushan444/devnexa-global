package com.devnexa.global.modules.booking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByClientEmail(String email);

    List<Booking> findByStatus(Booking.BookingStatus status);

    List<Booking> findByScheduledDate(LocalDate scheduledDate);
}
