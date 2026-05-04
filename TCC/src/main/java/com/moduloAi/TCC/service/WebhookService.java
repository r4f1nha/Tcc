package com.moduloAi.TCC.service;

import com.moduloAi.TCC.domain.Conversation;
import com.moduloAi.TCC.domain.Message;
import com.moduloAi.TCC.dto.MessageResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class WebhookService {

    private static final Logger log = LoggerFactory.getLogger(WebhookService.class);

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
        log.info("Webhook recebido event={} payload_keys={}", payload.get("event"),
                payload.containsKey("payload") ? ((Map<?,?>)payload.get("payload")).keySet() : "null");

        // WAHA envia: { "event": "message", "payload": { ... } }
        Map<String, Object> wahaPayload = (Map<String, Object>) payload.get("payload");
        if (wahaPayload == null) return;

        boolean fromMe = Boolean.TRUE.equals(wahaPayload.get("fromMe"));
        String from = (String) wahaPayload.get("from");
        String to   = (String) wahaPayload.get("to");
        String wahaMessageId = (String) wahaPayload.get("id");
        log.info("fromMe={} from={} to={} wahaMessageId={} body={}", fromMe, from, to, wahaMessageId, wahaPayload.get("body"));

        // Deduplicação por ID: message + message.any disparam para a mesma mensagem
        if (wahaMessageId != null && conversationService.messageAlreadyProcessed(wahaMessageId)) {
            log.info("Mensagem {} já processada, ignorando duplicata", wahaMessageId);
            return;
        }

        // No WAHA GOWS, 'from' sempre contém o número do lead (em ambas as direções)
        String wahaChatId = from;

        String messageBody = (String) wahaPayload.get("body");
        boolean hasMedia = Boolean.TRUE.equals(wahaPayload.get("hasMedia"));

        // Nome do contato: tenta _data.notifyName, depois _data.Info.PushName
        String leadName = null;
        Map<String, Object> data = (Map<String, Object>) wahaPayload.get("_data");
        if (data != null) {
            leadName = (String) data.get("notifyName");
            if (leadName == null) {
                Map<String, Object> info = (Map<String, Object>) data.get("Info");
                if (info != null) leadName = (String) info.get("PushName");
            }
        }

        if (wahaChatId == null) return;
        String leadPhone = wahaChatId.replace("@s.whatsapp.net", "").replace("@c.us", "");
        // Normalize to @c.us for consistent DB lookup regardless of WAHA field used
        String normalizedChatId = leadPhone + "@c.us";

        Conversation conversation = conversationService.findOrCreateConversation(
                normalizedChatId, leadName, leadPhone, session);

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

        // fromMe=false → mensagem do lead; fromMe=true → resposta do bot
        String senderName = fromMe ? "Bot" : leadName;
        Message message = conversationService.saveMessage(
                conversation, messageBody, type, senderName, !fromMe, mediaUrl, wahaMessageId);

        MessageResponse messageResponse = new MessageResponse(
                message.getId(), conversation.getId(), message.getContent(),
                message.getType().name(), message.getSenderName(), message.isFromLead(),
                message.getMediaUrl(), message.getCreatedAt()
        );
        sseService.pushMessage(messageResponse);
        sseService.pushConversationUpdate(conversationService.toConversationResponse(conversation));

        // Só processa automação para mensagens recebidas (não para respostas do bot)
        if (!fromMe) {
            automationService.processMessageReceived(conversation, message);
        }
    }
}
