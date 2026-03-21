export interface Label {
  readonly id: string;
  readonly name: string;
  readonly color: string;
  readonly description: string;
  readonly showOnSidebar: boolean;
  readonly conversationCount: number;
  readonly tenantId: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface CreateLabelDto {
  name: string;
  color: string;
  description: string;
  showOnSidebar: boolean;
}

export const LABEL_PRESET_COLORS = [
  '#1F93FF',
  '#3C4858',
  '#F9AE00',
  '#FF7E5D',
  '#865EC6',
  '#F56565',
  '#48BB78',
  '#4299E1',
  '#ED8936',
  '#9F7AEA',
  '#68D391',
  '#FC8181',
] as const;
