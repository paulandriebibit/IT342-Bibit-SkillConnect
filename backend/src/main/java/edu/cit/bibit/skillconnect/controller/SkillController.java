package edu.cit.bibit.skillconnect.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.cit.bibit.skillconnect.model.Skill;
import edu.cit.bibit.skillconnect.repository.SkillRepository;

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
            System.err.println("Error creating skill: " + e.getMessage());
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}