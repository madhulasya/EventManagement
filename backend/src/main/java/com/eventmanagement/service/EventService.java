// src/main/java/com/eventmanagement/service/EventService.java
package com.eventmanagement.service;

import com.eventmanagement.model.Event;
import com.eventmanagement.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class EventService {
    
    @Autowired
    private EventRepository eventRepository;
    
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }
    
    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }
    
    public Event createEvent(Event event) {
        // Set available tickets equal to total tickets
        event.setAvailableTickets(event.getTotalTickets());
        
        // Set a default image if none provided
        if (event.getImageUrl() == null || event.getImageUrl().isEmpty()) {
            event.setImageUrl("https://source.unsplash.com/featured/400x200/?" + event.getEventName().replace(" ", ","));
        }
        
        return eventRepository.save(event);
    }
    
    public Event updateEvent(Long id, Event eventDetails) {
        Optional<Event> optionalEvent = eventRepository.findById(id);
        if (optionalEvent.isPresent()) {
            Event event = optionalEvent.get();
            event.setEventName(eventDetails.getEventName());
            event.setDepartment(eventDetails.getDepartment());
            event.setLocation(eventDetails.getLocation());
            event.setTicketCost(eventDetails.getTicketCost());
            event.setTotalTickets(eventDetails.getTotalTickets());
            event.setAvailableTickets(eventDetails.getAvailableTickets());
            event.setEventDate(eventDetails.getEventDate());
            event.setEventTime(eventDetails.getEventTime());
            event.setDescription(eventDetails.getDescription());
            event.setImageUrl(eventDetails.getImageUrl());
            return eventRepository.save(event);
        }
        return null;
    }
    
    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }
}