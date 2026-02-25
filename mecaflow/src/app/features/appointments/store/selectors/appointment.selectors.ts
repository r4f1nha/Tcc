import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppointmentState, appointmentAdapter } from '../reducers/appointment.reducer';

export const selectAppointmentState =
  createFeatureSelector<AppointmentState>('appointments');

const { selectAll } = appointmentAdapter.getSelectors();

export const selectAllAppointments = createSelector(selectAppointmentState, selectAll);

export const selectAppointmentLoading = createSelector(
  selectAppointmentState,
  (state) => state.loading,
);

export const selectSelectedDate = createSelector(
  selectAppointmentState,
  (state) => state.selectedDate,
);

export const selectCurrentView = createSelector(
  selectAppointmentState,
  (state) => state.currentView,
);

export const selectPendingCount = createSelector(
  selectAppointmentState,
  (state) => state.pendingCount,
);

export const selectAppointmentsByDate = (date: string) =>
  createSelector(selectAllAppointments, (appointments) =>
    appointments.filter((a) => a.startTime.startsWith(date)),
  );
