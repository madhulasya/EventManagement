// src/main/java/com/eventmanagement/service/EmailService.java
package com.eventmanagement.service;

import com.eventmanagement.model.Booking;
import com.eventmanagement.model.Event;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String fromEmail;
    
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd MMMM yyyy");
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("hh:mm a");
    
    public void sendBookingConfirmation(Booking booking, Event event, String studentName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(booking.getStudentEmail());
            helper.setSubject("🎫 Your Ticket Confirmation - " + event.getEventName());
            
            String emailContent = generateTicketEmail(booking, event, studentName);
            helper.setText(emailContent, true);
            
            mailSender.send(message);
            System.out.println("✅ Ticket email sent to: " + booking.getStudentEmail());
            
        } catch (Exception e) {
            System.err.println("❌ Failed to send email: " + e.getMessage());
        }
    }
    
    private String generateTicketEmail(Booking booking, Event event, String studentName) {
        String formattedDate = event.getEventDate().format(DATE_FORMATTER);
        String formattedTime = event.getEventTime().format(TIME_FORMATTER);
        String formattedBookingDate = booking.getBookingDate().format(DATE_FORMATTER);
        
        return "<!DOCTYPE html>\n" +
        "<html>\n" +
        "<head>\n" +
        "    <meta charset=\"UTF-8\">\n" +
        "    <style>\n" +
        "        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5; }\n" +
        "        .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); overflow: hidden; }\n" +
        "        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }\n" +
        "        .header h1 { margin: 0; font-size: 28px; }\n" +
        "        .header p { margin: 10px 0 0; opacity: 0.9; }\n" +
        "        .ticket { padding: 30px; }\n" +
        "        .ticket-title { font-size: 24px; font-weight: bold; color: #2c3e50; text-align: center; margin-bottom: 20px; }\n" +
        "        .ticket-details { background: #f8f9fa; border-radius: 15px; padding: 20px; margin: 20px 0; }\n" +
        "        .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e0e0e0; }\n" +
        "        .detail-row:last-child { border-bottom: none; }\n" +
        "        .detail-label { font-weight: bold; color: #667eea; }\n" +
        "        .detail-value { color: #2c3e50; }\n" +
        "        .total-amount { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; border-radius: 10px; margin: 20px 0; }\n" +
        "        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #999; }\n" +
        "        .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 50px; margin-top: 20px; }\n" +
        "        .event-icon { font-size: 50px; text-align: center; }\n" +
        "        .ticket-barcode { text-align: center; margin: 20px 0; padding: 15px; background: white; border: 2px dashed #667eea; border-radius: 10px; }\n" +
        "        .barcode-text { font-family: monospace; font-size: 20px; letter-spacing: 5px; color: #2c3e50; }\n" +
        "    </style>\n" +
        "</head>\n" +
        "<body>\n" +
        "    <div class=\"container\">\n" +
        "        <div class=\"header\">\n" +
        "            <div class=\"event-icon\">🎟️</div>\n" +
        "            <h1>Ticket Confirmed!</h1>\n" +
        "            <p>Your booking has been successfully confirmed</p>\n" +
        "        </div>\n" +
        "        <div class=\"ticket\">\n" +
        "            <div class=\"ticket-title\">🎫 EVENT TICKET</div>\n" +
        "            <div class=\"ticket-details\">\n" +
        "                <div class=\"detail-row\"><span class=\"detail-label\">🎯 Event Name:</span><span class=\"detail-value\"><b>" + event.getEventName() + "</b></span></div>\n" +
        "                <div class=\"detail-row\"><span class=\"detail-label\">🏢 Department:</span><span class=\"detail-value\">" + event.getDepartment() + "</span></div>\n" +
        "                <div class=\"detail-row\"><span class=\"detail-label\">📍 Location:</span><span class=\"detail-value\">" + event.getLocation() + "</span></div>\n" +
        "                <div class=\"detail-row\"><span class=\"detail-label\">📅 Date:</span><span class=\"detail-value\">" + formattedDate + "</span></div>\n" +
        "                <div class=\"detail-row\"><span class=\"detail-label\">⏰ Time:</span><span class=\"detail-value\">" + formattedTime + "</span></div>\n" +
        "                <div class=\"detail-row\"><span class=\"detail-label\">👤 Attendee Name:</span><span class=\"detail-value\">" + studentName + "</span></div>\n" +
        "                <div class=\"detail-row\"><span class=\"detail-label\">📞 Phone Number:</span><span class=\"detail-value\">" + booking.getPhoneNumber() + "</span></div>\n" +
        "                <div class=\"detail-row\"><span class=\"detail-label\">🎟️ Number of Tickets:</span><span class=\"detail-value\"><b>" + booking.getNumberOfTickets() + " tickets</b></span></div>\n" +
        "                <div class=\"detail-row\"><span class=\"detail-label\">🆔 Booking ID:</span><span class=\"detail-value\">#" + booking.getId() + "</span></div>\n" +
        "                <div class=\"detail-row\"><span class=\"detail-label\">📅 Booking Date:</span><span class=\"detail-value\">" + formattedBookingDate + "</span></div>\n" +
        "            </div>\n" +
        "            <div class=\"total-amount\">Total Amount: ₹" + String.format("%.2f", booking.getTotalCost()) + "</div>\n" +
        "            <div class=\"ticket-barcode\">\n" +
        "                <div class=\"barcode-text\">🎟️ ✦ ✦ ✦ ✦ ✦ ✦ ✦ 🎟️</div>\n" +
        "                <small>Show this ticket at the event entrance</small>\n" +
        "            </div>\n" +
        "            <div style=\"text-align: center;\">\n" +
        "                <a href=\"http://localhost:3000/booking-history\" class=\"button\">View My Bookings</a>\n" +
        "            </div>\n" +
        "        </div>\n" +
        "        <div class=\"footer\">\n" +
        "            <p>This is an electronic ticket. Please carry your student ID card.</p>\n" +
        "            <p>For any queries, contact the event coordinator.</p>\n" +
        "            <p>© 2024 College Event Management System</p>\n" +
        "        </div>\n" +
        "    </div>\n" +
        "</body>\n" +
        "</html>";
    }
}