package com.moduloAi.TCC.dto;

import java.math.BigDecimal;

public record LeadRequest(
        String name,
        String company,
        String origin,
        String email,
        String phone,
        BigDecimal value,
        String stage,
        String priority,
        String nextStep,
        String notes
) {
}