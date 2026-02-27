export enum AutomationEvent {
  MESSAGE_RECEIVED = 'MESSAGE_RECEIVED',
  CONVERSATION_CREATED = 'CONVERSATION_CREATED',
  CONVERSATION_UPDATED = 'CONVERSATION_UPDATED',
  CONVERSATION_OPENED = 'CONVERSATION_OPENED',
  CONVERSATION_RESOLVED = 'CONVERSATION_RESOLVED',
}

export enum ConditionAttribute {
  MESSAGE_CONTENT = 'MESSAGE_CONTENT',
  LABEL = 'LABEL',
  CONVERSATION_STATUS = 'CONVERSATION_STATUS',
  ASSIGNED_AGENT = 'ASSIGNED_AGENT',
}

export enum ConditionOperator {
  CONTAINS = 'CONTAINS',
  NOT_CONTAINS = 'NOT_CONTAINS',
  EQUAL = 'EQUAL',
  NOT_EQUAL = 'NOT_EQUAL',
}

export enum AutomationActionType {
  ADD_LABEL = 'ADD_LABEL',
  REMOVE_LABEL = 'REMOVE_LABEL',
  ASSIGN_AGENT = 'ASSIGN_AGENT',
  SEND_MESSAGE = 'SEND_MESSAGE',
  CHANGE_STATUS = 'CHANGE_STATUS',
}

export interface AutomationCondition {
  attribute: ConditionAttribute;
  operator: ConditionOperator;
  value: string;
}

export interface AutomationActionItem {
  actionType: AutomationActionType;
  value: string;
}

export interface Automation {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly event: AutomationEvent;
  readonly conditions: ReadonlyArray<AutomationCondition>;
  readonly conditionMatch: 'ALL' | 'ANY';
  readonly actions: ReadonlyArray<AutomationActionItem>;
  readonly active: boolean;
  readonly tenantId: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface AutomationLog {
  readonly id: string;
  readonly automationId: string;
  readonly leadId: string;
  readonly leadName: string;
  readonly executedAt: string;
  readonly success: boolean;
  readonly errorMessage: string | null;
}

export const EVENT_LABELS: Record<AutomationEvent, string> = {
  [AutomationEvent.MESSAGE_RECEIVED]: 'Mensagem recebida',
  [AutomationEvent.CONVERSATION_CREATED]: 'Conversa criada',
  [AutomationEvent.CONVERSATION_UPDATED]: 'Conversa atualizada',
  [AutomationEvent.CONVERSATION_OPENED]: 'Conversa aberta',
  [AutomationEvent.CONVERSATION_RESOLVED]: 'Conversa resolvida',
};

export const CONDITION_ATTRIBUTE_LABELS: Record<ConditionAttribute, string> = {
  [ConditionAttribute.MESSAGE_CONTENT]: 'Conteúdo da mensagem',
  [ConditionAttribute.LABEL]: 'Etiqueta',
  [ConditionAttribute.CONVERSATION_STATUS]: 'Status da conversa',
  [ConditionAttribute.ASSIGNED_AGENT]: 'Agente atribuído',
};

export const CONDITION_OPERATOR_LABELS: Record<ConditionOperator, string> = {
  [ConditionOperator.CONTAINS]: 'contém',
  [ConditionOperator.NOT_CONTAINS]: 'não contém',
  [ConditionOperator.EQUAL]: 'é igual a',
  [ConditionOperator.NOT_EQUAL]: 'não é igual a',
};

export const ACTION_TYPE_LABELS: Record<AutomationActionType, string> = {
  [AutomationActionType.ADD_LABEL]: 'Adicionar etiqueta',
  [AutomationActionType.REMOVE_LABEL]: 'Remover etiqueta',
  [AutomationActionType.ASSIGN_AGENT]: 'Atribuir agente',
  [AutomationActionType.SEND_MESSAGE]: 'Enviar mensagem',
  [AutomationActionType.CHANGE_STATUS]: 'Mudar status',
};
