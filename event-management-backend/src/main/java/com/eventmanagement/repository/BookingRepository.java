// src/main/java/com/eventmanagement/repository/BookingRepository.java
package com.eventmanagement.repository;

import com.eventmanagement.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    List<Booking> findByStudentEmailOrderByBookingDateDesc(String studentEmail);
    
    List<Booking> findByEventId(Long eventId);
    
    List<Booking> findByStatus(String status);
    
    @Query("SELECT b FROM Booking b WHERE b.studentEmail = :email AND b.status = 'CONFIRMED'")
    List<Booking> findConfirmedBookingsByStudentEmail(@Param("email") String email);
    
    long countByEventId(Long eventId);
}