package com.moduloAi.TCC.repository;

import com.moduloAi.TCC.domain.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    Optional<Conversation> findByWahaChatId(String wahaChatId);
    List<Conversation> findByStatusOrderByLastMessageAtDesc(Conversation.ConversationStatus status);
    List<Conversation> findByStatusNotOrderByLastMessageAtDesc(Conversation.ConversationStatus status);
    List<Conversation> findByStatusInOrderByLastMessageAtDesc(List<Conversation.ConversationStatus> statuses);
    List<Conversation> findAllByOrderByLastMessageAtDesc();
}
