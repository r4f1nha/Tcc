package com.moduloAi.TCC.dto;

public record LeadResponse(
        Long id,
        String name,
        String email,
        String cpf,
        String phone
) {}
