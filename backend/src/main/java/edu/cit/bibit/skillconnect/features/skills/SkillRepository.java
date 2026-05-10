package edu.cit.bibit.skillconnect.features.skills;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {
    // You can add custom queries here later, like:
    List<Skill> findByCategory(String category);
}