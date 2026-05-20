
package com.eventmanagement.controller;

import com.eventmanagement.model.Student;
import com.eventmanagement.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:3000")
public class StudentController {
    @Autowired
    private StudentService studentService;
    
    @PostMapping("/profile")
    public ResponseEntity<Student> saveProfile(@Valid @RequestBody Student student) {
        Student savedStudent = studentService.saveOrUpdateStudent(student);
        return ResponseEntity.ok(savedStudent);
    }
    
    @GetMapping("/profile/{email}")
    public ResponseEntity<Student> getProfile(@PathVariable String email) {
        Student student = studentService.getStudentByEmail(email);
        return student != null ? ResponseEntity.ok(student) : ResponseEntity.notFound().build();
    }
    
    @GetMapping("/all")
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }
}