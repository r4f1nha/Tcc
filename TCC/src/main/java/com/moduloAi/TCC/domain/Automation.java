package com.moduloAi.TCC.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter @NoArgsConstructor
@Table(name = "automations")
public class Automation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AutomationEvent event;

    @Enumerated(EnumType.STRING)
    @Column(name = "condition_match", nullable = false)
    private ConditionMatch conditionMatch = ConditionMatch.ALL;

    @OneToMany(mappedBy = "automation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AutomationCondition> conditions = new ArrayList<>();

    @OneToMany(mappedBy = "automation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AutomationAction> actions = new ArrayList<>();

    private boolean active = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum AutomationEvent {
        MESSAGE_RECEIVED, CONVERSATION_CREATED, CONVERSATION_RESOLVED
    }

    public enum ConditionMatch {
        ALL, ANY
    }
}
