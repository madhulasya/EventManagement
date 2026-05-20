// src/main/java/com/eventmanagement/service/BookingService.java
package com.eventmanagement.service;

import com.eventmanagement.model.Booking;
import com.eventmanagement.model.Event;
import com.eventmanagement.repository.BookingRepository;
import com.eventmanagement.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private JavaMailSender mailSender;
    
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd MMMM yyyy");
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("hh:mm a");
    
    @Transactional
    public Booking createBooking(Booking booking) {
        Optional<Event> optionalEvent = eventRepository.findById(booking.getEventId());
        
        if (optionalEvent.isPresent()) {
            Event event = optionalEvent.get();
            
            if (event.getAvailableTickets() >= booking.getNumberOfTickets()) {
                
                double totalCost = event.getTicketCost() * booking.getNumberOfTickets();
                booking.setTotalCost(totalCost);
                
                booking.setBookingDate(LocalDateTime.now());
                booking.setStatus("CONFIRMED");
                
                int newAvailableTickets = event.getAvailableTickets() - booking.getNumberOfTickets();
                event.setAvailableTickets(newAvailableTickets);
                eventRepository.save(event);
                
                Booking savedBooking = bookingRepository.save(booking);
                
                // Send email confirmation
                sendConfirmationEmail(savedBooking, event);
                
                return savedBooking;
            } else {
                throw new RuntimeException("Not enough tickets available. Only " + event.getAvailableTickets() + " tickets left.");
            }
        } else {
            throw new RuntimeException("Event not found with id: " + booking.getEventId());
        }
    }
    
    private void sendConfirmationEmail(Booking booking, Event event) {
        try {
            String formattedDate = event.getEventDate().format(DATE_FORMATTER);
            String formattedTime = event.getEventTime().format(TIME_FORMATTER);
            String formattedBookingDate = booking.getBookingDate().format(DATE_FORMATTER);
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(booking.getStudentEmail());
            message.setSubject("🎫 Booking Confirmed - " + event.getEventName());
            
            String emailContent = 
                "═══════════════════════════════════════════════════════════\n" +
                "              🎫 TICKET CONFIRMATION 🎫\n" +
                "═══════════════════════════════════════════════════════════\n\n" +
                "Dear Student,\n\n" +
                "Your booking has been successfully confirmed!\n\n" +
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                "                     EVENT DETAILS\n" +
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                "  🎯 Event Name      : " + event.getEventName() + "\n" +
                "  🏢 Department      : " + event.getDepartment() + "\n" +
                "  📍 Location        : " + event.getLocation() + "\n" +
                "  📅 Date            : " + formattedDate + "\n" +
                "  ⏰ Time            : " + formattedTime + "\n\n" +
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                "                     BOOKING DETAILS\n" +
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                "  🎟️ Tickets Booked  : " + booking.getNumberOfTickets() + "\n" +
                "  💰 Total Cost      : ₹" + String.format("%.2f", booking.getTotalCost()) + "\n" +
                "  📞 Phone Number    : " + booking.getPhoneNumber() + "\n" +
                "  🆔 Booking ID      : #" + booking.getId() + "\n" +
                "  📅 Booking Date    : " + formattedBookingDate + "\n" +
                "  ✅ Status          : CONFIRMED\n\n" +
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                "📌 IMPORTANT INSTRUCTIONS:\n" +
                "  • Please carry your Student ID card to the event\n" +
                "  • Show this email or booking ID at the entrance\n" +
                "  • Arrive 15 minutes before the event starts\n\n" +
                "🔗 View your booking history:\n" +
                "  http://localhost:3000/booking-history\n\n" +
                "Thank you for booking with us!\n\n" +
                "Best regards,\n" +
                "College Event Management Team\n" +
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
                "  This is an auto-generated email. Please do not reply.\n" +
                "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";
            
            message.setText(emailContent);
            mailSender.send(message);
            
            System.out.println("✅ Confirmation email sent to: " + booking.getStudentEmail());
            
        } catch (Exception e) {
            System.err.println("❌ Failed to send email to " + booking.getStudentEmail() + ": " + e.getMessage());
        }
    }
    
    public List<Booking> getStudentBookings(String email) {
        List<Booking> bookings = bookingRepository.findByStudentEmailOrderByBookingDateDesc(email);
        for (Booking booking : bookings) {
            Optional<Event> event = eventRepository.findById(booking.getEventId());
            event.ifPresent(value -> booking.setEventName(value.getEventName()));
        }
        return bookings;
    }
    
    @Transactional
    public void cancelBooking(Long bookingId) {
        Optional<Booking> optionalBooking = bookingRepository.findById(bookingId);
        if (optionalBooking.isPresent()) {
            Booking booking = optionalBooking.get();
            if (!"CANCELLED".equals(booking.getStatus())) {
                booking.setStatus("CANCELLED");
                bookingRepository.save(booking);
                
                Optional<Event> optionalEvent = eventRepository.findById(booking.getEventId());
                if (optionalEvent.isPresent()) {
                    Event event = optionalEvent.get();
                    event.setAvailableTickets(event.getAvailableTickets() + booking.getNumberOfTickets());
                    eventRepository.save(event);
                    System.out.println("✅ Booking " + bookingId + " cancelled. Tickets returned to event.");
                }
            }
        }
    }
    
    public List<Booking> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAll();
        for (Booking booking : bookings) {
            Optional<Event> event = eventRepository.findById(booking.getEventId());
            event.ifPresent(value -> booking.setEventName(value.getEventName()));
        }
        return bookings;
    }
    
    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }
}