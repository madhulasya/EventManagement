// src/main/java/com/eventmanagement/model/Event.java
package com.eventmanagement.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "events")
public class Event {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "event_name", nullable = false)
    private String eventName;
    
    @Column(nullable = false)
    private String department;
    
    @Column(nullable = false)
    private String location;
    
    @Column(name = "ticket_cost", nullable = false)
    private Double ticketCost;
    
    @Column(name = "total_tickets", nullable = false)
    private Integer totalTickets;
    
    @Column(name = "available_tickets", nullable = false)
    private Integer availableTickets;
    
    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;
    
    @Column(name = "event_time", nullable = false)
    private LocalTime eventTime;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @Column(length = 1000)
    private String description;
    
    // Default constructor
    public Event() {}
    
    // Getters
    public Long getId() {
        return id;
    }
    
    public String getEventName() {
        return eventName;
    }
    
    public String getDepartment() {
        return department;
    }
    
    public String getLocation() {
        return location;
    }
    
    public Double getTicketCost() {
        return ticketCost;
    }
    
    public Integer getTotalTickets() {
        return totalTickets;
    }
    
    public Integer getAvailableTickets() {
        return availableTickets;
    }
    
    public LocalDate getEventDate() {
        return eventDate;
    }
    
    public LocalTime getEventTime() {
        return eventTime;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public String getDescription() {
        return description;
    }
    
    // Setters
    public void setId(Long id) {
        this.id = id;
    }
    
    public void setEventName(String eventName) {
        this.eventName = eventName;
    }
    
    public void setDepartment(String department) {
        this.department = department;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public void setTicketCost(Double ticketCost) {
        this.ticketCost = ticketCost;
    }
    
    public void setTotalTickets(Integer totalTickets) {
        this.totalTickets = totalTickets;
    }
    
    public void setAvailableTickets(Integer availableTickets) {
        this.availableTickets = availableTickets;
    }
    
    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }
    
    public void setEventTime(LocalTime eventTime) {
        this.eventTime = eventTime;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
}