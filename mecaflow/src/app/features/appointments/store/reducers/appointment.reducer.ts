import { createReducer, on } from '@ngrx/store';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { Appointment, AppointmentStatus, CalendarView } from '../../models/appointment.model';
import { AppointmentActions } from '../actions/appointment.actions';

export interface AppointmentState extends EntityState<Appointment> {
  readonly selectedDate: string;
  readonly currentView: CalendarView;
  readonly loading: boolean;
  readonly error: string | null;
  readonly pendingCount: number;
}

export const appointmentAdapter: EntityAdapter<Appointment> =
  createEntityAdapter<Appointment>({
    selectId: (a) => a.id,
    sortComparer: (a, b) =>
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
  });

const initialState: AppointmentState = appointmentAdapter.getInitialState({
  selectedDate: new Date().toISOString().split('T')[0],
  currentView: CalendarView.WEEK,
  loading: false,
  error: null,
  pendingCount: 0,
});

export const appointmentReducer = createReducer(
  initialState,

  on(AppointmentActions.loadAppointments, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AppointmentActions.loadAppointmentsSuccess, (state, { appointments }) =>
    appointmentAdapter.setAll([...appointments], {
      ...state,
      loading: false,
      pendingCount: appointments.filter((a) => a.status === AppointmentStatus.PENDING).length,
    }),
  ),
  on(AppointmentActions.loadAppointmentsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(AppointmentActions.createAppointmentSuccess, (state, { appointment }) =>
    appointmentAdapter.addOne(appointment, state),
  ),

  on(
    AppointmentActions.confirmAppointmentSuccess,
    AppointmentActions.cancelAppointmentSuccess,
    (state, { appointment }) =>
      appointmentAdapter.upsertOne(appointment, {
        ...state,
        pendingCount: Math.max(0, state.pendingCount - 1),
      }),
  ),

  on(AppointmentActions.changeView, (state, { view }) => ({
    ...state,
    currentView: view,
  })),

  on(AppointmentActions.selectDate, (state, { date }) => ({
    ...state,
    selectedDate: date,
  })),
);
