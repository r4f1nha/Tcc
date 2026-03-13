package com.moduloAi.TCC.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LeadRequest(
        @NotBlank String name,
        @Email String email,
        String cpf,
        String phone
) {}
