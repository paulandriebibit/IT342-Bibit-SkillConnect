package edu.cit.bibit.skillconnect.repository;

import edu.cit.bibit.skillconnect.model.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {
    // You can add custom queries here later, like:
    List<Skill> findByCategory(String category);
}