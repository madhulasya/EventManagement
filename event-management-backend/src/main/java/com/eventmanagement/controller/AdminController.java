// src/main/java/com/eventmanagement/controller/AdminController.java
package com.eventmanagement.controller;

import com.eventmanagement.model.Admin;
import com.eventmanagement.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {
    
    @Autowired
    private AdminRepository adminRepository;
    
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> adminLogin(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        
        System.out.println("Admin login attempt - Email: " + email);
        
        Optional<Admin> admin = adminRepository.findByEmailAndPassword(email, password);
        
        Map<String, String> response = new HashMap<>();
        if (admin.isPresent()) {
            response.put("status", "success");
            response.put("message", "Login successful");
            System.out.println("Admin login successful: " + email);
            return ResponseEntity.ok(response);
        } else {
            response.put("status", "error");
            response.put("message", "Invalid credentials");
            System.out.println("Admin login failed: " + email);
            return ResponseEntity.status(401).body(response);
        }
    }
}