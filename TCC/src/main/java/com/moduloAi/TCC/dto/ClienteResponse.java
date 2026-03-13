package com.moduloAi.TCC.dto;

public record ClienteResponse(
        Long id,
        String nome,
        String email,
        String cpf,
        String telefone
) {
}
