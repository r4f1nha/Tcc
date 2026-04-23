package com.moduloAi.TCC.controller;

import com.moduloAi.TCC.domain.Conversation;
import com.moduloAi.TCC.dto.*;
import com.moduloAi.TCC.service.ConversationService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/conversations")
public class ConversationController {

    private final ConversationService conversationService;

    public ConversationController(ConversationService conversationService) {
        this.conversationService = conversationService;
    }

    @GetMapping
    public List<ConversationResponse> list(@RequestParam(required = false) String status) {
        Conversation.ConversationStatus statusEnum = status != null
                ? Conversation.ConversationStatus.valueOf(status.toUpperCase())
                : null;
        return conversationService.getAll(statusEnum);
    }

    @GetMapping("/{id}")
    public ConversationResponse getById(@PathVariable Long id) {
        return conversationService.getById(id);
    }

    @GetMapping("/{id}/messages")
    public Page<MessageResponse> getMessages(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        return conversationService.getMessages(id, page, size);
    }

    @PostMapping("/{id}/send")
    public ResponseEntity<Void> sendMessage(@PathVariable Long id,
                                            @Valid @RequestBody SendMessageRequest request) {
        conversationService.sendMessage(id, request.content());
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/resolve")
    public ConversationResponse resolve(@PathVariable Long id) {
        return conversationService.resolve(id);
    }

    @PatchMapping("/{id}/assign")
    public ConversationResponse assign(@PathVariable Long id,
                                       @RequestBody AssignRequest request) {
        return conversationService.assignAgent(id, request);
    }

    @PatchMapping("/{id}/human")
    public ConversationResponse setHuman(@PathVariable Long id) {
        return conversationService.setHumanMode(id);
    }

    @PatchMapping("/{id}/bot")
    public ConversationResponse setBot(@PathVariable Long id) {
        return conversationService.setBotMode(id);
    }

    @PostMapping("/{id}/labels")
    public ConversationResponse addLabel(@PathVariable Long id,
                                         @Valid @RequestBody AddLabelRequest request) {
        return conversationService.addLabel(id, request.labelId());
    }

    @DeleteMapping("/{id}/labels/{labelId}")
    public ConversationResponse removeLabel(@PathVariable Long id,
                                             @PathVariable Long labelId) {
        return conversationService.removeLabel(id, labelId);
    }
}
