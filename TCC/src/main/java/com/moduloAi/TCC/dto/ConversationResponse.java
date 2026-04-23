package com.moduloAi.TCC.dto;

import java.time.LocalDateTime;
import java.util.List;

public record ConversationResponse(
    Long id,
    String wahaChatId,
    String leadName,
    String leadPhone,
    String session,
    String status,
    String assignedAgentId,
    String assignedAgentName,
    String lastMessage,
    LocalDateTime lastMessageAt,
    int unreadCount,
    List<LabelResponse> labels,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
