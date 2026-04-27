import { createActionGroup, props } from '@ngrx/store';

import {
  Appointment,
  AppointmentFilters,
  CalendarView,
  CreateAppointmentPayload,
  UpdateAppointmentPayload,
} from '../../models/appointment.model';

export const AppointmentActions = createActionGroup({
  source: 'Appointments',
  events: {
    'Load Appointments': props<{ filters: AppointmentFilters }>(),
    'Load Appointments Success': props<{
      appointments: ReadonlyArray<Appointment>;
    }>(),
    'Load Appointments Failure': props<{ error: string }>(),

    'Create Appointment': props<{ payload: CreateAppointmentPayload }>(),
    'Create Appointment Success': props<{ appointment: Appointment }>(),
    'Create Appointment Failure': props<{ error: string }>(),

    'Update Appointment': props<{
      id: number;
      payload: UpdateAppointmentPayload;
    }>(),
    'Update Appointment Success': props<{ appointment: Appointment }>(),
    'Update Appointment Failure': props<{ error: string }>(),

    'Delete Appointment': props<{ id: number }>(),
    'Delete Appointment Success': props<{ id: number }>(),
    'Delete Appointment Failure': props<{ error: string }>(),

    'Confirm Appointment': props<{ id: number }>(),
    'Confirm Appointment Success': props<{ appointment: Appointment }>(),
    'Confirm Appointment Failure': props<{ error: string }>(),

    'Cancel Appointment': props<{ id: number }>(),
    'Cancel Appointment Success': props<{ appointment: Appointment }>(),
    'Cancel Appointment Failure': props<{ error: string }>(),

    'Change View': props<{ view: CalendarView }>(),
    'Select Date': props<{ date: string }>(),
  },
});