package edu.cit.bibit.skillconnect.features.auth;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.annotation.PostConstruct;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostConstruct
    public void initAdmin() {
        if (!userRepository.existsByEmail("admin@skillconnect.edu.ph")) {
            User admin = new User();
            admin.setFirstname("System");
            admin.setLastname("Administrator");
            admin.setEmail("admin@skillconnect.edu.ph");
            
            admin.setPassword(passwordEncoder.encode("admin123")); 
            
            admin.setStudentId("CIT-ADMIN-01");
            admin.setMajor("CCS");
            admin.setRole("ADMIN");
            admin.setCreatedAt(java.time.LocalDateTime.now().toString());
            
            userRepository.save(admin);
            System.out.println(">>> [SYSTEM CONFIG]: Pre-generated admin@skillconnect.edu.ph initialized with password 'admin123' successfully.");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        if (user.getEmail() == null || user.getPassword() == null) {
            return ResponseEntity.status(400).body("Email and password are required");
        }
        
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.status(409).body("Email already registered");
        }
        
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        if (user.getRole() == null) {
            user.setRole("STUDENT");
        }
        if (user.getCreatedAt() == null) {
            user.setCreatedAt(java.time.LocalDateTime.now().toString());
        }
        
        userRepository.save(user);
        return ResponseEntity.status(201).body("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        if (email == null || password == null) {
            return ResponseEntity.status(400).body(Map.of("message", "Email and password are required"));
        }

        return userRepository.findByEmail(email)
                .map(user -> {
                    if (passwordEncoder.matches(password, user.getPassword())) {
                        Map<String, Object> response = new HashMap<>();
                        response.put("id", user.getId());
                        response.put("firstname", user.getFirstname());
                        response.put("lastname", user.getLastname());
                        response.put("email", user.getEmail());
                        response.put("role", user.getRole());
                        response.put("studentId", user.getStudentId());
                        response.put("major", user.getMajor());
                        response.put("phone", user.getPhone());
                        response.put("bio", user.getBio());
                        response.put("profileImage", user.getProfileImage()); 

                        return ResponseEntity.ok(response);
                    } else {
                        return ResponseEntity.status(401).body(Map.of("message", "Invalid password"));
                    }
                }) 
                .orElse(ResponseEntity.status(401).body(Map.of("message", "User not found")));
    }
}