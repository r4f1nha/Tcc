package com.moduloAi.TCC.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Agenda {

    @Id
    @GeneratedValue
    private long id;

    @ManyToOne
    @JoinColumn
    private Cliente cliente;

    private String titulo;
    private String descricao;
    private String cnpj;
    private OffsetDateTime startAt;
    private OffsetDateTime endAt;

    public Agenda(
            Cliente cliente,
            String titulo,
            String descricao,
            String cnpj,
            OffsetDateTime startAt,
            OffsetDateTime endAt
    ) {
        this.cliente = cliente;
        this.titulo = titulo;
        this.descricao = descricao;
        this.cnpj = cnpj;
        this.startAt = startAt;
        this.endAt = endAt;
    }
}