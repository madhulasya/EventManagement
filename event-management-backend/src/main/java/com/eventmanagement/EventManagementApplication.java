// src/main/java/com/eventmanagement/EventManagementApplication.java
package com.eventmanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class EventManagementApplication {
    public static void main(String[] args) {
        SpringApplication.run(EventManagementApplication.class, args);
        System.out.println("✅ Event Management System Backend Started Successfully!");
        System.out.println("📌 API available at: http://localhost:8080/api/events");
    }
}