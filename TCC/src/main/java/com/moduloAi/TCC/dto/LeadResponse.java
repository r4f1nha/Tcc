package com.moduloAi.TCC.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record LeadResponse(
        Long id,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        String name,
        String company,
        String origin,
        String email,
        String phone,
        BigDecimal value,
        String stage,
        String priority,
        String status,
        String nextStep,
        String notes
) {
}