export enum ServiceOrderStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  WAITING_PARTS = 'WAITING_PARTS',
  COMPLETED = 'COMPLETED',
}

export enum ViewMode {
  BOARD = 'BOARD',
  LIST = 'LIST',
}

export interface ServiceOrder {
  readonly id: string;
  readonly title: string;
  readonly leadId: string;
  readonly leadName: string;
  readonly assignedAgentId: string | null;
  readonly assignedAgentName: string | null;
  readonly estimatedValue: number;
  readonly deadline: string;
  readonly status: ServiceOrderStatus;
  readonly description: string;
  readonly tenantId: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface KanbanColumn {
  readonly status: ServiceOrderStatus;
  readonly label: string;
  readonly color: string;
  readonly orders: ReadonlyArray<ServiceOrder>;
}

export interface KanbanFilters {
  readonly agentId: string | null;
  readonly status: ServiceOrderStatus | null;
  readonly overdueOnly: boolean;
}

export const KANBAN_COLUMNS: ReadonlyArray<{ status: ServiceOrderStatus; label: string; color: string }> = [
  { status: ServiceOrderStatus.OPEN, label: 'Aberto', color: '#4F6EF7' },
  { status: ServiceOrderStatus.IN_PROGRESS, label: 'Em andamento', color: '#eab308' },
  { status: ServiceOrderStatus.WAITING_PARTS, label: 'Aguardando peça', color: '#f97316' },
  { status: ServiceOrderStatus.COMPLETED, label: 'Concluído', color: '#22c55e' },
];

export const STATUS_ORDER: ReadonlyArray<ServiceOrderStatus> = [
  ServiceOrderStatus.OPEN,
  ServiceOrderStatus.IN_PROGRESS,
  ServiceOrderStatus.WAITING_PARTS,
  ServiceOrderStatus.COMPLETED,
];
