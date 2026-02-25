export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  DONE = 'DONE',
}

export enum CalendarView {
  MONTH = 'MONTH',
  WEEK = 'WEEK',
  DAY = 'DAY',
}

export interface Appointment {
  readonly id: string;
  readonly leadId: string;
  readonly leadName: string;
  readonly agentId: string | null;
  readonly tenantId: string;
  readonly title: string;
  readonly description: string;
  readonly serviceType: string;
  readonly startTime: string;
  readonly endTime: string;
  readonly status: AppointmentStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface AppointmentFilters {
  readonly date: string;
  readonly status: AppointmentStatus | null;
  readonly agentId: string | null;
}

export interface TimeSlot {
  readonly start: string;
  readonly end: string;
  readonly available: boolean;
}

export interface BlockedSlot {
  readonly id: string;
  readonly dayOfWeek: number;
  readonly startTime: string;
  readonly endTime: string;
  readonly reason: string;
}

export interface CreateAppointmentPayload {
  readonly leadId: string;
  readonly title: string;
  readonly description: string;
  readonly serviceType: string;
  readonly startTime: string;
  readonly endTime: string;
}
