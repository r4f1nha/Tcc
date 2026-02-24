package com.moduloAi.TCC.dto;

public record ClienteResponse(
        long id,
        String nome,
        String email,
        String cpf,
        String telefone
) {
}
