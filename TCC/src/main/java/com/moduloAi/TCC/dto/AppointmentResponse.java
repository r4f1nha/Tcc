package com.moduloAi.TCC.dto;

import java.time.OffsetDateTime;

public record AppointmentResponse(
        Long id,
        Long leadId,
        String leadName,
        String title,
        String description,
        OffsetDateTime startAt,
        OffsetDateTime endAt
) {}
