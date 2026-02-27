export interface WorkshopSettings {
  readonly id: string;
  readonly tenantId: string;
  readonly workshopName: string;
  readonly phone: string;
  readonly address: string;
  readonly workingHoursStart: string;
  readonly workingHoursEnd: string;
  readonly workingDays: ReadonlyArray<number>;
  readonly slotDurationMinutes: number;
  readonly logoUrl: string | null;
}

export interface NotificationSettings {
  readonly whatsappEnabled: boolean;
  readonly emailEnabled: boolean;
  readonly appointmentReminder: boolean;
  readonly reminderHoursBefore: number;
}
