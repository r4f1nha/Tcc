package com.moduloAi.TCC.service;

import com.moduloAi.TCC.domain.Conversation;
import com.moduloAi.TCC.domain.Label;
import com.moduloAi.TCC.domain.Message;
import com.moduloAi.TCC.dto.AssignRequest;
import com.moduloAi.TCC.dto.ConversationResponse;
import com.moduloAi.TCC.dto.LabelResponse;
import com.moduloAi.TCC.dto.MessagePageResponse;
import com.moduloAi.TCC.dto.MessageResponse;
import com.moduloAi.TCC.repository.ConversationRepository;
import com.moduloAi.TCC.repository.LabelRepository;
import com.moduloAi.TCC.repository.MessageRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final LabelRepository labelRepository;
    private final WahaApiService wahaApiService;
    private final StringRedisTemplate redisTemplate;

    public ConversationService(ConversationRepository conversationRepository,
                               MessageRepository messageRepository,
                               LabelRepository labelRepository,
                               WahaApiService wahaApiService,
                               StringRedisTemplate redisTemplate) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.labelRepository = labelRepository;
        this.wahaApiService = wahaApiService;
        this.redisTemplate = redisTemplate;
    }

    public Conversation findOrCreateConversation(String wahaChatId, String leadName, String leadPhone, String session) {
        return conversationRepository.findByWahaChatId(wahaChatId).orElseGet(() -> {
            Conversation c = new Conversation();
            c.setWahaChatId(wahaChatId);
            c.setLeadName(leadName);
            c.setLeadPhone(leadPhone);
            c.setSession(session);
            return conversationRepository.save(c);
        });
    }

    public Message saveMessage(Conversation conversation, String content, Message.MessageType type,
                               String senderName, boolean isFromLead, String mediaUrl, String wahaMessageId) {
        Message message = new Message();
        message.setConversation(conversation);
        message.setContent(content);
        message.setType(type);
        message.setSenderName(senderName);
        message.setFromLead(isFromLead);
        message.setMediaUrl(mediaUrl);
        message.setWahaMessageId(wahaMessageId);
        Message saved = messageRepository.save(message);

        conversation.setLastMessage(content);
        conversation.setLastMessageAt(LocalDateTime.now());
        if (isFromLead) {
            conversation.setUnreadCount(conversation.getUnreadCount() + 1);
        }
        conversationRepository.save(conversation);

        return saved;
    }

    @Transactional(readOnly = true)
    public List<ConversationResponse> getAll(String tab) {
        List<Conversation> list;
        if (tab == null || tab.equalsIgnoreCase("ALL")) {
            list = conversationRepository.findByStatusNotOrderByLastMessageAtDesc(
                    Conversation.ConversationStatus.RESOLVED);
        } else if (tab.equalsIgnoreCase("MINE")) {
            list = conversationRepository.findByStatusOrderByLastMessageAtDesc(
                    Conversation.ConversationStatus.HUMAN);
        } else if (tab.equalsIgnoreCase("UNASSIGNED")) {
            list = conversationRepository.findByStatusInOrderByLastMessageAtDesc(
                    List.of(Conversation.ConversationStatus.UNASSIGNED, Conversation.ConversationStatus.BOT));
        } else if (tab.equalsIgnoreCase("RESOLVED")) {
            list = conversationRepository.findByStatusOrderByLastMessageAtDesc(
                    Conversation.ConversationStatus.RESOLVED);
        } else {
            list = conversationRepository.findAllByOrderByLastMessageAtDesc();
        }
        return list.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ConversationResponse getById(Long id) {
        return toResponse(findById(id));
    }

    @Transactional(readOnly = true)
    public MessagePageResponse getMessages(Long conversationId, int page, int size) {
        Page<Message> messagePage = messageRepository.findByConversationIdOrderByCreatedAtAsc(
                conversationId, PageRequest.of(page, size));
        List<MessageResponse> data = messagePage.getContent().stream()
                .map(this::toMessageResponse).toList();
        return new MessagePageResponse(data, !messagePage.isLast(), messagePage.getTotalElements());
    }

    public MessageResponse sendMessage(Long conversationId, String content) {
        Conversation conversation = findById(conversationId);
        String wahaMessageId = wahaApiService.sendText(conversation.getWahaChatId(), content);
        Message saved = saveMessage(conversation, content, Message.MessageType.TEXT, "Agente", false, null, wahaMessageId);

        // Bloqueia o bot no Redis sempre que um agente envia mensagem pelo sistema
        if (conversation.getStatus() != Conversation.ConversationStatus.HUMAN) {
            conversation.setStatus(Conversation.ConversationStatus.HUMAN);
            conversationRepository.save(conversation);
        }
        redisTemplate.opsForValue().set(redisKey(conversation.getWahaChatId()), "true");

        return toMessageResponse(saved);
    }

    @Transactional(readOnly = true)
    public boolean messageAlreadyProcessed(String wahaMessageId) {
        return messageRepository.existsByWahaMessageId(wahaMessageId);
    }

    public ConversationResponse toConversationResponse(Conversation c) {
        return toResponse(c);
    }

    public ConversationResponse resolve(Long conversationId) {
        Conversation conversation = findById(conversationId);
        conversation.setStatus(Conversation.ConversationStatus.RESOLVED);
        return toResponse(conversationRepository.save(conversation));
    }

    public ConversationResponse assignAgent(Long conversationId, AssignRequest request) {
        Conversation conversation = findById(conversationId);
        conversation.setAssignedAgentId(request.agentId());
        conversation.setAssignedAgentName(request.agentName());
        conversation.setStatus(Conversation.ConversationStatus.HUMAN);
        return toResponse(conversationRepository.save(conversation));
    }

    public ConversationResponse reopen(Long conversationId) {
        Conversation conversation = findById(conversationId);
        conversation.setStatus(Conversation.ConversationStatus.UNASSIGNED);
        conversation.setAssignedAgentId(null);
        conversation.setAssignedAgentName(null);
        return toResponse(conversationRepository.save(conversation));
    }

    public ConversationResponse addLabel(Long conversationId, Long labelId) {
        Conversation conversation = findById(conversationId);
        Label label = labelRepository.findById(labelId)
                .orElseThrow(() -> new EntityNotFoundException("Label not found: " + labelId));
        if (!conversation.getLabels().contains(label)) {
            conversation.getLabels().add(label);
        }
        return toResponse(conversationRepository.save(conversation));
    }

    public ConversationResponse removeLabel(Long conversationId, Long labelId) {
        Conversation conversation = findById(conversationId);
        conversation.getLabels().removeIf(l -> l.getId().equals(labelId));
        return toResponse(conversationRepository.save(conversation));
    }

    public ConversationResponse setHumanMode(Long conversationId) {
        Conversation conversation = findById(conversationId);
        conversation.setStatus(Conversation.ConversationStatus.HUMAN);
        // Bloqueia o bot no Redis compartilhado com n8n (sem TTL = permanente)
        redisTemplate.opsForValue().set(redisKey(conversation.getWahaChatId()), "true");
        return toResponse(conversationRepository.save(conversation));
    }

    public ConversationResponse setBotMode(Long conversationId) {
        Conversation conversation = findById(conversationId);
        conversation.setStatus(Conversation.ConversationStatus.BOT);
        // Libera o bot deletando a chave do Redis
        redisTemplate.delete(redisKey(conversation.getWahaChatId()));
        return toResponse(conversationRepository.save(conversation));
    }

    private String redisKey(String wahaChatId) {
        return "CloudSolutions_" + wahaChatId + "_block";
    }

    private Conversation findById(Long id) {
        return conversationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Conversation not found: " + id));
    }

    private ConversationResponse toResponse(Conversation c) {
        List<LabelResponse> labels = c.getLabels().stream()
                .map(l -> new LabelResponse(l.getId(), l.getName(), l.getDescription(), l.getColor()))
                .toList();
        return new ConversationResponse(
                c.getId(), c.getWahaChatId(), c.getLeadName(), c.getLeadPhone(),
                c.getSession(), c.getStatus().name(), c.getAssignedAgentId(), c.getAssignedAgentName(),
                c.getLastMessage(), c.getLastMessageAt(), c.getUnreadCount(), labels,
                c.getCreatedAt(), c.getUpdatedAt()
        );
    }

    private MessageResponse toMessageResponse(Message m) {
        return new MessageResponse(
                m.getId(), m.getConversation().getId(), m.getContent(),
                m.getType().name(), m.getSenderName(), m.isFromLead(),
                m.getMediaUrl(), m.getCreatedAt()
        );
    }
}
