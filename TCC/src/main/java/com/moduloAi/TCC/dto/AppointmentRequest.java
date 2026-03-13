package com.moduloAi.TCC.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.OffsetDateTime;

public record AppointmentRequest(
        @NotNull Long leadId,
        @NotBlank String title,
        String description,
        @NotNull OffsetDateTime startAt,
        @NotNull OffsetDateTime endAt
) {}
