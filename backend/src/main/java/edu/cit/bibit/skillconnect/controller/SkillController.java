package edu.cit.bibit.skillconnect.controller;

import edu.cit.bibit.skillconnect.model.Skill;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import edu.cit.bibit.skillconnect.repository.SkillRepository;

import java.util.List;

@RestController
@RequestMapping("/api/v1/skills")
@CrossOrigin(origins = "http://localhost:3000")
public class SkillController {

    @Autowired
    private SkillRepository skillRepository;

    // GET all skills for the Marketplace
    @GetMapping
    public ResponseEntity<List<Skill>> getAllSkills() {
        return ResponseEntity.ok(skillRepository.findAll());
    }

    // POST a new skill (Offer Skill feature)
    @PostMapping
    public ResponseEntity<?> createSkill(@RequestBody Skill skill) {
        try {
            // Log it to the IntelliJ console so you can see if the data arrived
            System.out.println("Received Skill: " + skill.getTitle());

            Skill savedSkill = skillRepository.save(skill);
            return ResponseEntity.status(201).body(savedSkill);
        } catch (Exception e) {
            e.printStackTrace(); // This prints the EXACT error in IntelliJ
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}