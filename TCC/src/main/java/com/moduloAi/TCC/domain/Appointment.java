package com.moduloAi.TCC.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "agenda")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "titulo", nullable = false)
    private String title;

    @Column(name = "descricao")
    private String description;

    @Column(name = "tipo_servico")
    private String serviceType;

    @Column(name = "start_at", nullable = false)
    private OffsetDateTime startAt;

    @Column(name = "end_at", nullable = false)
    private OffsetDateTime endAt;

    public Appointment(
            String title,
            String description,
            String serviceType,
            OffsetDateTime startAt,
            OffsetDateTime endAt
    ) {
        this.title = title;
        this.description = description;
        this.serviceType = serviceType;
        this.startAt = startAt;
        this.endAt = endAt;
    }
}