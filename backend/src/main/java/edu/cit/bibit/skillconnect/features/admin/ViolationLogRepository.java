package edu.cit.bibit.skillconnect.features.admin;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ViolationLogRepository extends JpaRepository<ViolationLog, Long> {
}