package com.moduloAi.TCC.dto;

import java.time.LocalDateTime;

public record MessageResponse(
    Long id,
    Long conversationId,
    String content,
    String type,
    String senderName,
    boolean isFromLead,
    String mediaUrl,
    LocalDateTime createdAt
) {}
