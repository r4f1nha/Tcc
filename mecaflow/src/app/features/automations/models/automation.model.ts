export enum AutomationAction {
  SEND_MESSAGE = 'SEND_MESSAGE',
  ASSIGN_AGENT = 'ASSIGN_AGENT',
  CHANGE_STATUS = 'CHANGE_STATUS',
}

export interface Automation {
  readonly id: string;
  readonly name: string;
  readonly triggerLabelId: string;
  readonly triggerLabelName: string;
  readonly action: AutomationAction;
  readonly actionConfig: Record<string, string>;
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
