
package com.eventmanagement.service;

import com.eventmanagement.model.Student;
import com.eventmanagement.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class StudentService {
    @Autowired
    private StudentRepository studentRepository;
    
    public Student saveOrUpdateStudent(Student student) {
        Student existingStudent = studentRepository.findByEmail(student.getEmail()).orElse(null);
        if (existingStudent != null) {
            // Update existing student
            existingStudent.setFirstName(student.getFirstName());
            existingStudent.setLastName(student.getLastName());
            existingStudent.setVtuNumber(student.getVtuNumber());
            existingStudent.setCollegeName(student.getCollegeName());
            existingStudent.setGender(student.getGender());
            existingStudent.setPhoneNumber(student.getPhoneNumber());
            return studentRepository.save(existingStudent);
        } else {
            // Create new student
            student.setRegistrationDate(LocalDateTime.now());
            return studentRepository.save(student);
        }
    }
    
    public Student getStudentByEmail(String email) {
        return studentRepository.findByEmail(email).orElse(null);
    }
    
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }
}