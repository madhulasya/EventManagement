// src/main/java/com/eventmanagement/controller/AdminDashboardController.java
package com.eventmanagement.controller;

import com.eventmanagement.model.Booking;
import com.eventmanagement.model.Event;
import com.eventmanagement.model.Student;
import com.eventmanagement.service.BookingService;
import com.eventmanagement.service.EventService;
import com.eventmanagement.service.StudentService;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/dashboard")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminDashboardController {
    
    @Autowired
    private BookingService bookingService;
    
    @Autowired
    private EventService eventService;
    
    @Autowired
    private StudentService studentService;
    
    @GetMapping("/students")
    public ResponseEntity<List<Student>> getAllStudents() {
        List<Student> students = studentService.getAllStudents();
        return ResponseEntity.ok(students);
    }
    
    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping("/bookings/student/{email}")
    public ResponseEntity<List<Booking>> getStudentBookings(@PathVariable String email) {
        List<Booking> bookings = bookingService.getStudentBookings(email);
        return ResponseEntity.ok(bookings);
    }
    
    @DeleteMapping("/booking/{id}")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long id) {
        try {
            bookingService.cancelBooking(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/export/excel")
    public ResponseEntity<byte[]> exportToExcel() {
        try {
            List<Booking> bookings = bookingService.getAllBookings();
            
            Workbook workbook = new XSSFWorkbook();
            Sheet sheet = workbook.createSheet("Student Bookings");
            
            // Create header row
            Row header = sheet.createRow(0);
            String[] columns = {"Booking ID", "Student Email", "Event Name", "Tickets", "Total Cost", "Booking Date", "Status", "Phone Number"};
            
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            
            for (int i = 0; i < columns.length; i++) {
                Cell cell = header.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }
            
            // Fill data
            int rowNum = 1;
            for (Booking booking : bookings) {
                Row row = sheet.createRow(rowNum++);
                Optional<Event> optionalEvent = eventService.getEventById(booking.getEventId());
                String eventName = optionalEvent.map(Event::getEventName).orElse("Unknown");
                
                row.createCell(0).setCellValue(booking.getId());
                row.createCell(1).setCellValue(booking.getStudentEmail());
                row.createCell(2).setCellValue(eventName);
                row.createCell(3).setCellValue(booking.getNumberOfTickets());
                row.createCell(4).setCellValue(booking.getTotalCost());
                row.createCell(5).setCellValue(booking.getBookingDate() != null ? 
                    booking.getBookingDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")) : "");
                row.createCell(6).setCellValue(booking.getStatus());
                row.createCell(7).setCellValue(booking.getPhoneNumber() != null ? booking.getPhoneNumber() : "");
            }
            
            // Auto-size columns
            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }
            
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            workbook.close();
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=student_bookings.xlsx");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(outputStream.toByteArray());
                    
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        List<Booking> bookings = bookingService.getAllBookings();
        List<Event> events = eventService.getAllEvents();
        
        long totalBookings = bookings.size();
        double totalRevenue = bookings.stream()
                .filter(b -> "CONFIRMED".equals(b.getStatus()))
                .mapToDouble(Booking::getTotalCost)
                .sum();
        long totalStudents = bookings.stream()
                .map(Booking::getStudentEmail)
                .distinct()
                .count();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalBookings", totalBookings);
        stats.put("totalRevenue", totalRevenue);
        stats.put("totalStudents", totalStudents);
        stats.put("totalEvents", (long) events.size());
        
        return ResponseEntity.ok(stats);
    }
}