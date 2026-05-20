// src/main/java/com/eventmanagement/repository/EventRepository.java
package com.eventmanagement.repository;

import com.eventmanagement.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    
    List<Event> findByDepartment(String department);
    
    List<Event> findByAvailableTicketsGreaterThan(Integer tickets);
    
    List<Event> findByEventDateAfter(LocalDate date);
    
    @Query("SELECT e FROM Event e WHERE e.availableTickets > 0 ORDER BY e.eventDate ASC")
    List<Event> findUpcomingEvents();
    
    @Query("SELECT e FROM Event e WHERE e.eventName LIKE %:keyword% OR e.department LIKE %:keyword%")
    List<Event> searchEvents(@Param("keyword") String keyword);
}