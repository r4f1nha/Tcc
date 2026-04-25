package com.moduloAi.TCC.dto;

public record ServiceOrderRequest(
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
