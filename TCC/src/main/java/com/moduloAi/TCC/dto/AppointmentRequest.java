package com.moduloAi.TCC.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.OffsetDateTime;

public record AppointmentRequest(
        @NotBlank String title,
        String description,
        String serviceType,
        @NotNull OffsetDateTime startAt,
        @NotNull OffsetDateTime endAt
) {
}