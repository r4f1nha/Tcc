package com.moduloAi.TCC.service;

import com.moduloAi.TCC.domain.*;
import com.moduloAi.TCC.dto.AutomationActionDto;
import com.moduloAi.TCC.dto.AutomationConditionDto;
import com.moduloAi.TCC.dto.AutomationRequest;
import com.moduloAi.TCC.dto.AutomationResponse;
import com.moduloAi.TCC.repository.AutomationRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class AutomationService {

    private final AutomationRepository automationRepository;
    private final ConversationService conversationService;
    private final WahaApiService wahaApiService;

    public AutomationService(AutomationRepository automationRepository,
                             ConversationService conversationService,
                             WahaApiService wahaApiService) {
        this.automationRepository = automationRepository;
        this.conversationService = conversationService;
        this.wahaApiService = wahaApiService;
    }

    public void processMessageReceived(Conversation conversation, Message message) {
        List<Automation> automations = automationRepository.findByEventAndActiveTrue(
                Automation.AutomationEvent.MESSAGE_RECEIVED);
        for (Automation automation : automations) {
            if (evaluateConditions(automation, conversation, message)) {
                automation.getActions().forEach(action -> executeAction(action, conversation));
            }
        }
    }

    private boolean evaluateConditions(Automation automation, Conversation conversation, Message message) {
        List<AutomationCondition> conditions = automation.getConditions();
        if (conditions.isEmpty()) return true;

        boolean isAll = automation.getConditionMatch() == Automation.ConditionMatch.ALL;

        for (AutomationCondition condition : conditions) {
            boolean result = evaluateSingle(condition, conversation, message);
            if (isAll && !result) return false;
            if (!isAll && result) return true;
        }

        return isAll;
    }

    private boolean evaluateSingle(AutomationCondition condition, Conversation conversation, Message message) {
        String value = condition.getValue();
        return switch (condition.getAttribute()) {
            case MESSAGE_CONTENT -> {
                String content = message.getContent() != null ? message.getContent().toLowerCase() : "";
                yield switch (condition.getOperator()) {
                    case CONTAINS -> content.contains(value.toLowerCase());
                    case NOT_CONTAINS -> !content.contains(value.toLowerCase());
                    default -> false;
                };
            }
            case LABEL -> {
                boolean hasLabel = conversation.getLabels().stream()
                        .anyMatch(l -> l.getId().toString().equals(value));
                yield switch (condition.getOperator()) {
                    case EQUAL -> hasLabel;
                    case NOT_EQUAL -> !hasLabel;
                    default -> false;
                };
            }
            case CONVERSATION_STATUS -> {
                boolean matches = conversation.getStatus().name().equals(value);
                yield switch (condition.getOperator()) {
                    case EQUAL -> matches;
                    case NOT_EQUAL -> !matches;
                    default -> false;
                };
            }
        };
    }

    private void executeAction(AutomationAction action, Conversation conversation) {
        switch (action.getActionType()) {
            case ADD_LABEL -> conversationService.addLabel(conversation.getId(), Long.parseLong(action.getValue()));
            case REMOVE_LABEL -> conversationService.removeLabel(conversation.getId(), Long.parseLong(action.getValue()));
            case ASSIGN_AGENT -> {
                // valor no formato "agentId:agentName"
                String[] parts = action.getValue().split(":", 2);
                conversationService.assignAgent(conversation.getId(),
                        new com.moduloAi.TCC.dto.AssignRequest(parts[0], parts.length > 1 ? parts[1] : null));
            }
            case SEND_MESSAGE -> wahaApiService.sendText(conversation.getWahaChatId(), action.getValue());
            case CHANGE_STATUS -> {
                if ("HUMAN".equals(action.getValue())) {
                    conversationService.setHumanMode(conversation.getId());
                } else if ("BOT".equals(action.getValue())) {
                    conversationService.setBotMode(conversation.getId());
                } else if ("RESOLVED".equals(action.getValue())) {
                    conversationService.resolve(conversation.getId());
                }
            }
        }
    }

    @Transactional(readOnly = true)
    public List<AutomationResponse> list() {
        return automationRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public AutomationResponse findById(Long id) {
        return toResponse(getOrThrow(id));
    }

    public AutomationResponse create(AutomationRequest request) {
        Automation automation = fromRequest(request, new Automation());
        return toResponse(automationRepository.save(automation));
    }

    public AutomationResponse update(Long id, AutomationRequest request) {
        Automation automation = fromRequest(request, getOrThrow(id));
        return toResponse(automationRepository.save(automation));
    }

    public void delete(Long id) {
        automationRepository.deleteById(id);
    }

    public AutomationResponse toggle(Long id) {
        Automation automation = getOrThrow(id);
        automation.setActive(!automation.isActive());
        return toResponse(automationRepository.save(automation));
    }

    private Automation getOrThrow(Long id) {
        return automationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Automation not found: " + id));
    }

    private Automation fromRequest(AutomationRequest request, Automation automation) {
        automation.setName(request.name());
        automation.setDescription(request.description());
        automation.setEvent(Automation.AutomationEvent.valueOf(request.event()));
        automation.setConditionMatch(request.conditionMatch() != null
                ? Automation.ConditionMatch.valueOf(request.conditionMatch())
                : Automation.ConditionMatch.ALL);
        automation.setActive(request.active());

        automation.getConditions().clear();
        if (request.conditions() != null) {
            request.conditions().forEach(dto -> {
                AutomationCondition cond = new AutomationCondition();
                cond.setAutomation(automation);
                cond.setAttribute(AutomationCondition.ConditionAttribute.valueOf(dto.attribute()));
                cond.setOperator(AutomationCondition.ConditionOperator.valueOf(dto.operator()));
                cond.setValue(dto.value());
                automation.getConditions().add(cond);
            });
        }

        automation.getActions().clear();
        if (request.actions() != null) {
            request.actions().forEach(dto -> {
                AutomationAction act = new AutomationAction();
                act.setAutomation(automation);
                act.setActionType(AutomationAction.ActionType.valueOf(dto.actionType()));
                act.setValue(dto.value());
                automation.getActions().add(act);
            });
        }

        return automation;
    }

    private AutomationResponse toResponse(Automation a) {
        List<AutomationConditionDto> conditions = a.getConditions().stream()
                .map(c -> new AutomationConditionDto(c.getAttribute().name(), c.getOperator().name(), c.getValue()))
                .toList();
        List<AutomationActionDto> actions = a.getActions().stream()
                .map(ac -> new AutomationActionDto(ac.getActionType().name(), ac.getValue()))
                .toList();
        return new AutomationResponse(a.getId(), a.getName(), a.getDescription(),
                a.getEvent().name(), a.getConditionMatch().name(),
                conditions, actions, a.isActive(), a.getCreatedAt(), a.getUpdatedAt());
    }
}
