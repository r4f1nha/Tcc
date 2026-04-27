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
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly serviceType: string;
  readonly startAt: string;
  readonly endAt: string;
  readonly status?: AppointmentStatus;
  readonly createdAt?: string;
  readonly updatedAt?: string;
}

export interface AppointmentFilters {
  readonly date: string;
  readonly status: AppointmentStatus | null;
  readonly agentId: number | null;
}

export interface TimeSlot {
  readonly start: string;
  readonly end: string;
  readonly available: boolean;
}

export interface BlockedSlot {
  readonly id: number;
  readonly dayOfWeek: number;
  readonly startAt: string;
  readonly endAt: string;
  readonly reason: string;
}

export interface CreateAppointmentPayload {
  readonly title: string;
  readonly description: string;
  readonly serviceType: string;
  readonly startAt: string;
  readonly endAt: string;
}

export interface UpdateAppointmentPayload {
  readonly title?: string;
  readonly description?: string;
  readonly serviceType?: string;
  readonly startAt?: string;
  readonly endAt?: string;
  readonly status?: AppointmentStatus;
}