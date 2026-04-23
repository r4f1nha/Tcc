package com.moduloAi.TCC.dto;

import java.time.LocalDateTime;
import java.util.List;

public record AutomationResponse(
    Long id,
    String name,
    String description,
    String event,
    String conditionMatch,
    List<AutomationConditionDto> conditions,
    List<AutomationActionDto> actions,
    boolean active,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
