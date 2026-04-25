package com.moduloAi.TCC.dto;

import java.time.LocalDateTime;

public record ServiceOrderResponse(
        Long id,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        String customerName,
        String customerPhone,
        String vehicle,
        String plate,
        String problemDescription,
        String status,
        String priority,
        String assignedTo,
        String notes
) {
}
