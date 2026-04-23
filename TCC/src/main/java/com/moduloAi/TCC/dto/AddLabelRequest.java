package com.moduloAi.TCC.dto;

import jakarta.validation.constraints.NotNull;

public record AddLabelRequest(@NotNull Long labelId) {}
