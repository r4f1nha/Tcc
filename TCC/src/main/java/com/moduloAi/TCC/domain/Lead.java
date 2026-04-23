package com.moduloAi.TCC.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "leads")
public class Lead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(nullable = false)
    private String name;

    private String company;
    private String origin;
    private String email;
    private String phone;

    @Column(precision = 15, scale = 2)
    private BigDecimal value;

    @Column(nullable = false)
    private String stage;

    @Column(nullable = false)
    private String priority;

    @Column(nullable = false)
    private String status;

    @Column(name = "next_step")
    private String nextStep;

    @Column(columnDefinition = "TEXT")
    private String notes;
}