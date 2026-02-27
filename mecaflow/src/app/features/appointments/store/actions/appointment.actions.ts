import { createActionGroup, props } from '@ngrx/store';
import { Appointment, AppointmentFilters, CalendarView, CreateAppointmentPayload } from '../../models/appointment.model';

export const AppointmentActions = createActionGroup({
  source: 'Appointments',
  events: {
    'Load Appointments': props<{ filters: AppointmentFilters }>(),
    'Load Appointments Success': props<{ appointments: ReadonlyArray<Appointment> }>(),
    'Load Appointments Failure': props<{ error: string }>(),

    'Create Appointment': props<{ payload: CreateAppointmentPayload }>(),
    'Create Appointment Success': props<{ appointment: Appointment }>(),
    'Create Appointment Failure': props<{ error: string }>(),

    'Confirm Appointment': props<{ id: string }>(),
    'Confirm Appointment Success': props<{ appointment: Appointment }>(),

    'Cancel Appointment': props<{ id: string }>(),
    'Cancel Appointment Success': props<{ appointment: Appointment }>(),

    'Change View': props<{ view: CalendarView }>(),
    'Select Date': props<{ date: string }>(),
  },
});
