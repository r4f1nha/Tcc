package com.moduloAi.TCC.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record AutomationRequest(
    @NotBlank String name,
    String description,
    @NotNull String event,
    String conditionMatch,
    List<AutomationConditionDto> conditions,
    List<AutomationActionDto> actions,
    boolean active
) {}
