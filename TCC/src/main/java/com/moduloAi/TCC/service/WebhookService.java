package com.moduloAi.TCC.service;

import com.moduloAi.TCC.domain.Conversation;
import com.moduloAi.TCC.domain.Message;
import com.moduloAi.TCC.dto.MessageResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class WebhookService {

    private final ConversationService conversationService;
    private final AutomationService automationService;
    private final SseService sseService;
    private final String session;

    public WebhookService(ConversationService conversationService,
                          AutomationService automationService,
                          SseService sseService,
                          @Value("${waha.session}") String session) {
        this.conversationService = conversationService;
        this.automationService = automationService;
        this.sseService = sseService;
        this.session = session;
    }

    @SuppressWarnings("unchecked")
    public void process(Map<String, Object> payload) {
        Map<String, Object> body = (Map<String, Object>) payload.get("body");
        if (body == null) return;

        Map<String, Object> wahaPayload = (Map<String, Object>) body.get("payload");
        if (wahaPayload == null) return;

        Map<String, Object> key = (Map<String, Object>) wahaPayload.get("key");
        if (key != null && Boolean.TRUE.equals(key.get("fromMe"))) return;

        String wahaChatId = (String) wahaPayload.get("from");
        String messageBody = (String) wahaPayload.get("body");
        boolean hasMedia = Boolean.TRUE.equals(wahaPayload.get("hasMedia"));

        String leadName = null;
        Map<String, Object> data = (Map<String, Object>) wahaPayload.get("_data");
        if (data != null) {
            Map<String, Object> info = (Map<String, Object>) data.get("Info");
            if (info != null) leadName = (String) info.get("PushName");
        }

        String leadPhone = wahaChatId != null ? wahaChatId.replace("@s.whatsapp.net", "") : null;

        Conversation conversation = conversationService.findOrCreateConversation(
                wahaChatId, leadName, leadPhone, session);

        Message.MessageType type = Message.MessageType.TEXT;
        String mediaUrl = null;

        if (hasMedia) {
            Map<String, Object> media = (Map<String, Object>) wahaPayload.get("media");
            if (media != null) {
                mediaUrl = (String) media.get("url");
                String mimetype = (String) media.get("mimetype");
                if (mimetype != null) {
                    if (mimetype.contains("audio")) {
                        type = Message.MessageType.AUDIO;
                    } else if (mimetype.contains("image")) {
                        type = Message.MessageType.IMAGE;
                    } else {
                        type = Message.MessageType.DOCUMENT;
                    }
                }
            }
        }

        Message message = conversationService.saveMessage(
                conversation, messageBody, type, leadName, true, mediaUrl, null);

        MessageResponse messageResponse = new MessageResponse(
                message.getId(), conversation.getId(), message.getContent(),
                message.getType().name(), message.getSenderName(), message.isFromLead(),
                message.getMediaUrl(), message.getCreatedAt()
        );
        sseService.pushMessage(messageResponse);
        sseService.pushConversationUpdate(conversationService.toConversationResponse(conversation));

        automationService.processMessageReceived(conversation, message);
    }
}
