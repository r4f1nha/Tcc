package com.moduloAi.TCC.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.Optional;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Agenda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn
    private Cliente cliente;

    private String titulo;
    private String descricao;
    private OffsetDateTime startAt;
    private OffsetDateTime endAt;

    public Agenda(
            Cliente cliente,
            String titulo,
            String descricao,
            OffsetDateTime startAt,
            OffsetDateTime endAt
    ) {
        this.cliente = cliente;
        this.titulo = titulo;
        this.descricao = descricao;
        this.startAt = startAt;
        this.endAt = endAt;
    }
}