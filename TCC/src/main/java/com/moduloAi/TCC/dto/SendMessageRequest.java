package com.moduloAi.TCC.dto;

import jakarta.validation.constraints.NotBlank;

public record SendMessageRequest(
    @NotBlank String content
) {}
