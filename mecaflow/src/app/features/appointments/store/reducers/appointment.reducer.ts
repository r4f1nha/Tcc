import { createReducer, on } from '@ngrx/store';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';

import {
  Appointment,
  AppointmentStatus,
  CalendarView,
} from '../../models/appointment.model';

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
    sortComparer: (a, b) =>
      new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
  });

const initialState: AppointmentState = appointmentAdapter.getInitialState({
  selectedDate: new Date().toISOString().split('T')[0],
  currentView: CalendarView.WEEK,
  loading: false,
  error: null,
  pendingCount: 0,
});

function getAppointmentsFromState(state: AppointmentState): Appointment[] {
  return Object.values(state.entities).filter(
    (appointment): appointment is Appointment => !!appointment
  );
}

function countPending(appointments: ReadonlyArray<Appointment>): number {
  return appointments.filter(
    (appointment) => appointment.status === AppointmentStatus.PENDING
  ).length;
}

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
      error: null,
      pendingCount: countPending(appointments),
    })
  ),

  on(AppointmentActions.loadAppointmentsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(AppointmentActions.createAppointment, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AppointmentActions.createAppointmentSuccess, (state, { appointment }) => {
    const nextState = appointmentAdapter.addOne(appointment, {
      ...state,
      loading: false,
      error: null,
    });

    return {
      ...nextState,
      pendingCount: countPending(getAppointmentsFromState(nextState)),
    };
  }),

  on(AppointmentActions.createAppointmentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(AppointmentActions.updateAppointment, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AppointmentActions.updateAppointmentSuccess, (state, { appointment }) => {
    const nextState = appointmentAdapter.upsertOne(appointment, {
      ...state,
      loading: false,
      error: null,
    });

    return {
      ...nextState,
      pendingCount: countPending(getAppointmentsFromState(nextState)),
    };
  }),

  on(AppointmentActions.updateAppointmentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(AppointmentActions.deleteAppointment, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AppointmentActions.deleteAppointmentSuccess, (state, { id }) => {
    const nextState = appointmentAdapter.removeOne(id, {
      ...state,
      loading: false,
      error: null,
    });

    return {
      ...nextState,
      pendingCount: countPending(getAppointmentsFromState(nextState)),
    };
  }),

  on(AppointmentActions.deleteAppointmentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(AppointmentActions.confirmAppointmentSuccess, (state, { appointment }) => {
    const nextState = appointmentAdapter.upsertOne(appointment, state);

    return {
      ...nextState,
      pendingCount: countPending(getAppointmentsFromState(nextState)),
    };
  }),

  on(AppointmentActions.confirmAppointmentFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  on(AppointmentActions.cancelAppointmentSuccess, (state, { appointment }) => {
    const nextState = appointmentAdapter.upsertOne(appointment, state);

    return {
      ...nextState,
      pendingCount: countPending(getAppointmentsFromState(nextState)),
    };
  }),

  on(AppointmentActions.cancelAppointmentFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  on(AppointmentActions.changeView, (state, { view }) => ({
    ...state,
    currentView: view,
  })),

  on(AppointmentActions.selectDate, (state, { date }) => ({
    ...state,
    selectedDate: date,
  }))
);