package edu.cit.bibit.skillconnect.features.auth;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        Optional<User> userOptional = userRepository.findById(id);
        
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }
        
        User user = userOptional.get();
        
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("firstname", user.getFirstname());
        response.put("lastname", user.getLastname());
        response.put("email", user.getEmail());
        response.put("studentId", user.getStudentId());
        response.put("major", user.getMajor());
        response.put("phone", user.getPhone());
        response.put("bio", user.getBio());
        response.put("role", user.getRole());
        response.put("createdAt", user.getCreatedAt());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmailAvailability(@RequestParam String email, @RequestParam(required = false) Long excludeId) {
        boolean exists = userRepository.existsByEmail(email);
        
        if (exists && excludeId != null) {
            Optional<User> user = userRepository.findByEmail(email);
            if (user.isPresent() && user.get().getId().equals(excludeId)) {
                return ResponseEntity.ok(Map.of("available", true, "message", "This is your current email"));
            }
        }
        
        return ResponseEntity.ok(Map.of(
            "available", !exists,
            "message", exists ? "Email is already in use" : "Email is available"
        ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        Optional<User> userOptional = userRepository.findById(id);
        
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }
        
        User user = userOptional.get();
        
        if (updates.containsKey("firstname")) {
            user.setFirstname((String) updates.get("firstname"));
        }
        if (updates.containsKey("lastname")) {
            user.setLastname((String) updates.get("lastname"));
        }
        if (updates.containsKey("email")) {
            String newEmail = (String) updates.get("email");
            if (!user.getEmail().equals(newEmail) && userRepository.existsByEmail(newEmail)) {
                return ResponseEntity.status(409).body(Map.of("message", "Email already in use"));
            }
            user.setEmail(newEmail);
        }
        if (updates.containsKey("studentId")) {
            user.setStudentId((String) updates.get("studentId"));
        }
        if (updates.containsKey("major")) {
            user.setMajor((String) updates.get("major"));
        }
        if (updates.containsKey("phone")) {
            user.setPhone((String) updates.get("phone"));
        }
        if (updates.containsKey("bio")) {
            user.setBio((String) updates.get("bio"));
        }
        
        User savedUser = userRepository.save(user);
        
        Map<String, Object> response = new HashMap<>();
        response.put("id", savedUser.getId());
        response.put("firstname", savedUser.getFirstname());
        response.put("lastname", savedUser.getLastname());
        response.put("email", savedUser.getEmail());
        response.put("studentId", savedUser.getStudentId());
        response.put("major", savedUser.getMajor());
        response.put("phone", savedUser.getPhone());
        response.put("bio", savedUser.getBio());
        response.put("role", savedUser.getRole()); // FIX: Crucial role preservation element
        response.put("message", "Profile updated successfully");
        
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<?> changePassword(@PathVariable Long id, @RequestBody Map<String, String> passwordData) {
        Optional<User> userOptional = userRepository.findById(id);
        
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }
        
        User user = userOptional.get();
        String currentPassword = passwordData.get("currentPassword");
        String newPassword = passwordData.get("newPassword");
        
        if (currentPassword == null || newPassword == null) {
            return ResponseEntity.status(400).body(Map.of("message", "Both current and new passwords are required"));
        }
        
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("message", "Current password is incorrect"));
        }
        
        if (newPassword.length() < 6) {
            return ResponseEntity.status(400).body(Map.of("message", "New password must be at least 6 characters"));
        }
        
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }
}