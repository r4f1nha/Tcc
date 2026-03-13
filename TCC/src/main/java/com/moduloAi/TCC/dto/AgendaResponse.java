package com.moduloAi.TCC.dto;

import java.time.OffsetDateTime;

public record AgendaResponse(
        Long Id,
        Long clienteId,
        String titulo,
        String descricao,
        OffsetDateTime startAt,
        OffsetDateTime endAt
) {
}
