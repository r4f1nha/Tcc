import { createFeatureSelector, createSelector } from '@ngrx/store';

import {
  AppointmentState,
  appointmentAdapter,
} from '../reducers/appointment.reducer';

export const selectAppointmentState =
  createFeatureSelector<AppointmentState>('appointments');

const { selectAll, selectEntities, selectIds, selectTotal } =
  appointmentAdapter.getSelectors();

export const selectAllAppointments = createSelector(
  selectAppointmentState,
  selectAll
);

export const selectAppointmentEntities = createSelector(
  selectAppointmentState,
  selectEntities
);

export const selectAppointmentIds = createSelector(
  selectAppointmentState,
  selectIds
);

export const selectAppointmentTotal = createSelector(
  selectAppointmentState,
  selectTotal
);

export const selectAppointmentLoading = createSelector(
  selectAppointmentState,
  (state) => state.loading
);

export const selectAppointmentError = createSelector(
  selectAppointmentState,
  (state) => state.error
);

export const selectSelectedDate = createSelector(
  selectAppointmentState,
  (state) => state.selectedDate
);

export const selectCurrentView = createSelector(
  selectAppointmentState,
  (state) => state.currentView
);

export const selectPendingCount = createSelector(
  selectAppointmentState,
  (state) => state.pendingCount
);

export const selectAppointmentById = (id: string | number) =>
  createSelector(selectAppointmentEntities, (entities) => entities[id]);

export const selectAppointmentsByDate = (date: string) =>
  createSelector(selectAllAppointments, (appointments) =>
    appointments.filter((appointment) =>
      appointment.startAt?.startsWith(date)
    )
  );