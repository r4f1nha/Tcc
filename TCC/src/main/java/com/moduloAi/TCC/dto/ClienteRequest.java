package com.moduloAi.TCC.dto;

public record ClienteRequest(
        String nome,
        String email,
        String cpf,
        String telefone
) {
}
