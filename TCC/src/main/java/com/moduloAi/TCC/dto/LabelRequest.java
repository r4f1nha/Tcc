package com.moduloAi.TCC.dto;

import jakarta.validation.constraints.NotBlank;

public record LabelRequest(
        @NotBlank String name,
        String description,
        @NotBlank String color
) {}
