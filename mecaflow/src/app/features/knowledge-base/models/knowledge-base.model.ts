export enum KnowledgeCategory {
  HORARIOS = 'HORARIOS',
  SERVICOS = 'SERVICOS',
  PRECOS = 'PRECOS',
  POLITICAS = 'POLITICAS',
}

export interface KnowledgeEntry {
  readonly id: string;
  readonly title: string;
  readonly content: string;
  readonly category: KnowledgeCategory;
  readonly tenantId: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly createdBy: string;
}

export interface KnowledgeFilters {
  readonly search: string;
  readonly category: KnowledgeCategory | null;
}
