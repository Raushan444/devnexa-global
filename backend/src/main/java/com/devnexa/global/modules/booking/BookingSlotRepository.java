package com.devnexa.global.modules.booking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingSlotRepository extends JpaRepository<BookingSlot, Long> {

    List<BookingSlot> findByDate(LocalDate date);

    List<BookingSlot> findByDateAndIsAvailableTrue(LocalDate date);
}
