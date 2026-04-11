package edu.cit.bibit.skillconnect.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The student asking for the skill
    private Long requesterId;
    private String requesterName;

    // The student providing the skill
    private Long providerId;
    private String providerName;

    // The specific skill being swapped
    private Long skillId;
    private String skillTitle;

    // SDD Status: PENDING, CONFIRMED, COMPLETED, CANCELLED
    private String status;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "PENDING";
        }
    }
}