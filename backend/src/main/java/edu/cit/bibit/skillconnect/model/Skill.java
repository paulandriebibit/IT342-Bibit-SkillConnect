package edu.cit.bibit.skillconnect.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "skills")
@Data // This automatically generates Getters and Setters
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String category;


    private Long providerId;

    private String providerName;
}