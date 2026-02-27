export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED',
  CONVERTED = 'CONVERTED',
  LOST = 'LOST',
}

export interface Lead {
  readonly id: string;
  readonly name: string;
  readonly phone: string;
  readonly email: string | null;
  readonly tenantId: string;
  readonly status: LeadStatus;
  readonly labels: ReadonlyArray<LeadLabel>;
  readonly assignedAgentId: string | null;
  readonly assignedAgentName: string | null;
  readonly source: string;
  readonly avatarUrl: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface LeadLabel {
  readonly id: string;
  readonly name: string;
  readonly color: string;
}

export interface LeadFilters {
  readonly search: string;
  readonly status: LeadStatus | null;
  readonly labelId: string | null;
  readonly agentId: string | null;
  readonly dateFrom: string | null;
  readonly dateTo: string | null;
  readonly page: number;
  readonly pageSize: number;
}

export interface PaginatedResponse<T> {
  readonly data: ReadonlyArray<T>;
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly totalPages: number;
}

export interface LeadImportResult {
  readonly totalRows: number;
  readonly imported: number;
  readonly errors: ReadonlyArray<{ row: number; message: string }>;
}

export interface CreateLeadPayload {
  readonly name: string;
  readonly phone: string;
  readonly email: string | null;
  readonly source: string;
}
