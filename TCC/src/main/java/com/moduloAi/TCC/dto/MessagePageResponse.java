package com.moduloAi.TCC.dto;

import java.util.List;

public record MessagePageResponse(
    List<MessageResponse> data,
    boolean hasMore,
    long total
) {}
