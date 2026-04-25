export const ServiceOrderStatus = {
  ABERTA: 'ABERTA',
  EM_ANALISE: 'EM_ANALISE',
  AGUARDANDO_CLIENTE: 'AGUARDANDO_CLIENTE',
  FINALIZADA: 'FINALIZADA',
  CANCELADA: 'CANCELADA',
  COMPLETED: 'FINALIZADA',
} as const;

export type ServiceOrderStatus =
  (typeof ServiceOrderStatus)[keyof typeof ServiceOrderStatus];

export const ServiceOrderPriority = {
  BAIXA: 'BAIXA',
  MEDIA: 'MEDIA',
  ALTA: 'ALTA',
} as const;

export type ServiceOrderPriority =
  (typeof ServiceOrderPriority)[keyof typeof ServiceOrderPriority];

export const ViewMode = {
  BOARD: 'BOARD',
  LIST: 'LIST',
} as const;

export type ViewMode = (typeof ViewMode)[keyof typeof ViewMode];

export interface KanbanFilters {
  [key: string]: string | number | boolean | null | undefined;

  agentId?: number | null;
  status?: ServiceOrderStatus | null;
  overdueOnly?: boolean;

  search?: string;
  priority?: ServiceOrderPriority | null;
  assignedTo?: string;
}

export interface ServiceOrder {
  id: number;

  customerName?: string;
  customerPhone?: string;
  vehicle?: string;
  plate?: string;

  problemDescription?: string;
  status: ServiceOrderStatus;
  priority?: ServiceOrderPriority;

  assignedTo?: string;
  notes?: string;
deadline?: string;

  createdAt?: string;
  updatedAt?: string;
}

export type CreateServiceOrderRequest = Omit<ServiceOrder, 'id'>;

export interface ServiceOrderKanbanResponse {
  ABERTA: ServiceOrder[];
  EM_ANALISE: ServiceOrder[];
  AGUARDANDO_CLIENTE: ServiceOrder[];
  FINALIZADA: ServiceOrder[];
  CANCELADA?: ServiceOrder[];
}