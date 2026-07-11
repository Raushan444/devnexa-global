package com.devnexa.global.modules.public_shared;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @NotBlank
    @Email
    private String email;

    private String company;

    @NotBlank
    private String meetingType; // CONSULTATION, AUDIT, PARTNERSHIP

    private LocalDateTime scheduledTime;

    @Lob
    private String description;

    private String status = "PENDING"; // PENDING, APPROVED, CANCELLED, COMPLETED

    private LocalDateTime createdAt = LocalDateTime.now();

    public Appointment() {}

    public Appointment(String name, String email, String company, String meetingType, LocalDateTime scheduledTime, String description) {
        this.name = name;
        this.email = email;
        this.company = company;
        this.meetingType = meetingType;
        this.scheduledTime = scheduledTime;
        this.description = description;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getMeetingType() { return meetingType; }
    public void setMeetingType(String meetingType) { this.meetingType = meetingType; }

    public LocalDateTime getScheduledTime() { return scheduledTime; }
    public void setScheduledTime(LocalDateTime scheduledTime) { this.scheduledTime = scheduledTime; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
