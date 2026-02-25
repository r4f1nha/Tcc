import { Pipe, PipeTransform } from '@angular/core';

export interface StatusLabelMap {
  readonly [key: string]: string;
}

const TICKET_STATUS_LABELS: StatusLabelMap = {
  OPEN: 'Aberto',
  IN_PROGRESS: 'Em andamento',
  WAITING_CLIENT: 'Aguardando cliente',
  WAITING_AGENT: 'Aguardando atendente',
  RESOLVED: 'Resolvido',
  CLOSED: 'Fechado',
  CANCELLED: 'Cancelado',
};

const SERVICE_ORDER_STATUS_LABELS: StatusLabelMap = {
  DRAFT: 'Rascunho',
  PENDING: 'Pendente',
  APPROVED: 'Aprovada',
  IN_PROGRESS: 'Em execucao',
  COMPLETED: 'Concluida',
  CANCELLED: 'Cancelada',
  INVOICED: 'Faturada',
};

const USER_STATUS_LABELS: StatusLabelMap = {
  ACTIVE: 'Ativo',
  INACTIVE: 'Inativo',
  SUSPENDED: 'Suspenso',
};

const PAYMENT_STATUS_LABELS: StatusLabelMap = {
  PENDING: 'Pendente',
  PAID: 'Pago',
  OVERDUE: 'Vencido',
  CANCELLED: 'Cancelado',
  REFUNDED: 'Reembolsado',
};

const ALL_LABELS: StatusLabelMap = {
  ...TICKET_STATUS_LABELS,
  ...SERVICE_ORDER_STATUS_LABELS,
  ...USER_STATUS_LABELS,
  ...PAYMENT_STATUS_LABELS,
};

export type StatusDomain = 'ticket' | 'serviceOrder' | 'user' | 'payment' | 'all';

@Pipe({
  name: 'statusLabel',
  standalone: true,
})
export class StatusLabelPipe implements PipeTransform {
  transform(value: string | null | undefined, domain: StatusDomain = 'all'): string {
    if (!value) {
      return '';
    }

    const labelMap = this.getLabelMap(domain);
    return labelMap[value] ?? value;
  }

  private getLabelMap(domain: StatusDomain): StatusLabelMap {
    switch (domain) {
      case 'ticket':
        return TICKET_STATUS_LABELS;
      case 'serviceOrder':
        return SERVICE_ORDER_STATUS_LABELS;
      case 'user':
        return USER_STATUS_LABELS;
      case 'payment':
        return PAYMENT_STATUS_LABELS;
      case 'all':
      default:
        return ALL_LABELS;
    }
  }
}
