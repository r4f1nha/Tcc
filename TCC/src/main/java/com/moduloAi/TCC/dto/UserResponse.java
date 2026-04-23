package com.moduloAi.TCC.dto;

import com.moduloAi.TCC.domain.User;

import java.time.LocalDateTime;

public record UserResponse(
        Long id,
        String name,
        String email,
        String phone,
        User.Role role,
        boolean active,
        LocalDateTime createdAt
) {}
