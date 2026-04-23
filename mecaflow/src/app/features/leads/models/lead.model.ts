export type LeadStatus =
  | 'NOVO_LEAD'
  | 'QUALIFICACAO'
  | 'PROPOSTA'
  | 'NEGOCIACAO'
  | 'GANHO'
  | 'PERDIDO';

export type LeadPriority =
  | 'BAIXA'
  | 'MEDIA'
  | 'ALTA';

export interface Lead {
  id: number;
  name: string;
  company?: string;
  origin?: string;
  email?: string;
  phone?: string;
  value?: number;
  stage: LeadStatus;
  priority: LeadPriority;
  status: LeadStatus;
  nextStep?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLeadPayload {
  name: string;
  company?: string;
  origin?: string;
  email?: string;
  phone?: string;
  value?: number;
  stage: LeadStatus;
  priority: LeadPriority;
  nextStep?: string;
  notes?: string;
}

export interface LeadFilters {
  search?: string;
  status?: LeadStatus | '';
  page?: number;
  pageSize?: number;
}

export interface LeadImportResult {
  success: boolean;
  imported: number;
  failed: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}