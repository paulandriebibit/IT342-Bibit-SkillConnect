package edu.cit.bibit.skillconnect.controller;

import edu.cit.bibit.skillconnect.model.User;
import edu.cit.bibit.skillconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        // 1. Check if user exists
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.status(409).body("Email already registered");
        }
        // 2. ENCODE THE PASSWORD (Crucial Step)
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // 3. Save to Supabase
        userRepository.save(user);
        return ResponseEntity.status(201).body("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        return userRepository.findByEmail(email)
                .map(user -> {
                    if (passwordEncoder.matches(password, user.getPassword())) {
                        // We return a JSON object { "status": "success", ... }
                        return ResponseEntity.ok(Map.of(
                                "status", "success",
                                "email", user.getEmail(),
                                "name", user.getFirstname()
                        ));
                    } else {
                        return ResponseEntity.status(401).body(Map.of("message", "Invalid password"));
                    }
                })
                .orElse(ResponseEntity.status(401).body(Map.of("message", "User not found")));
    }
}