// src/main/java/com/eventmanagement/repository/AdminRepository.java
package com.eventmanagement.repository;

import com.eventmanagement.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
    Optional<Admin> findByEmailAndPassword(String email, String password);
    Optional<Admin> findByEmail(String email);
}