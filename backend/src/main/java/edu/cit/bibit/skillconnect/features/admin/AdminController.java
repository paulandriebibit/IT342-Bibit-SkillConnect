package edu.cit.bibit.skillconnect.features.admin;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import edu.cit.bibit.skillconnect.features.auth.UserRepository;
import edu.cit.bibit.skillconnect.features.bookings.BookingRepository;
import edu.cit.bibit.skillconnect.features.skills.Skill;
import edu.cit.bibit.skillconnect.features.skills.SkillRepository;

@RestController
@RequestMapping("/api/v1/admin")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ViolationLogRepository violationLogRepository;

    @GetMapping("/metrics")
    public ResponseEntity<?> getPlatformMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalStudents", userRepository.count() - 1); 
        metrics.put("totalSkills", skillRepository.count());
        metrics.put("totalBookings", bookingRepository.count());
        return ResponseEntity.ok(metrics);
    }

   
    @PostMapping("/skills/{id}/moderate")
    public ResponseEntity<?> moderateAndLogSkill(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String reason = payload.get("reason");
        if (reason == null || reason.trim().isEmpty()) {
            return ResponseEntity.status(400).body(Map.of("message", "A moderation reason is strictly required"));
        }

   
        Skill skill = skillRepository.findById(id).orElse(null);
        if (skill == null) {
            return ResponseEntity.status(404).body(Map.of("message", "Skill posting not found"));
        }

       
        ViolationLog log = new ViolationLog();
        log.setUserId(skill.getProviderId()); 
        log.setSkillTitle(skill.getTitle());
        log.setViolationReason(reason.trim());
        log.setLoggedAt(LocalDateTime.now().toString());
        violationLogRepository.save(log);

       
        skillRepository.delete(skill);

        return ResponseEntity.ok(Map.of("message", "Marketplace item moderated and warning logged to user account record"));
    }
}