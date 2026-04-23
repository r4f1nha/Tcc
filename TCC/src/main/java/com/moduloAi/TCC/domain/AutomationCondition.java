package com.moduloAi.TCC.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter @NoArgsConstructor
@Table(name = "automation_conditions")
public class AutomationCondition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "automation_id", nullable = false)
    private Automation automation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ConditionAttribute attribute;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ConditionOperator operator;

    @Column(nullable = false)
    private String value;

    public enum ConditionAttribute {
        MESSAGE_CONTENT, LABEL, CONVERSATION_STATUS
    }

    public enum ConditionOperator {
        CONTAINS, NOT_CONTAINS, EQUAL, NOT_EQUAL
    }
}
