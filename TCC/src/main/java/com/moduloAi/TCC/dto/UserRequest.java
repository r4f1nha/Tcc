package com.moduloAi.TCC.dto;

import com.moduloAi.TCC.domain.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UserRequest(
        @NotBlank String name,
        @NotBlank @Email String email,
        String phone,
        @NotNull User.Role role,
        @NotBlank @Size(min = 6) String password
) {}
