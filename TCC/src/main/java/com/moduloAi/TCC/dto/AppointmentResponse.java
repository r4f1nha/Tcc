package com.moduloAi.TCC.dto;

import java.time.OffsetDateTime;

public record AppointmentResponse(
        Long id,
        String title,
        String description,
        String serviceType,
        OffsetDateTime startAt,
        OffsetDateTime endAt
) {
}