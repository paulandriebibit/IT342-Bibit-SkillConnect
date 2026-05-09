package edu.cit.bibit.skillconnect.controller;

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

import edu.cit.bibit.skillconnect.model.User;
import edu.cit.bibit.skillconnect.repository.UserRepository;

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
                    // Return user object with ID
                    Map<String, Object> response = new HashMap<>();
                    response.put("id", user.getId());           // ← ADD THIS
                    response.put("email", user.getEmail());
                    response.put("firstname", user.getFirstname());
                    response.put("lastname", user.getLastname());
                    response.put("status", "success");
                    return ResponseEntity.ok(response);
                } else {
                    return ResponseEntity.status(401).body(Map.of("message", "Invalid password"));
                }
            })
            .orElse(ResponseEntity.status(401).body(Map.of("message", "User not found")));
}
}