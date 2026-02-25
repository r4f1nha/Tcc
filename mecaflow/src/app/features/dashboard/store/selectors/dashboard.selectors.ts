import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DashboardState } from '../reducers/dashboard.reducer';

export const selectDashboardState =
  createFeatureSelector<DashboardState>('dashboard');

export const selectMetrics = createSelector(
  selectDashboardState,
  (state) => state.metrics,
);

export const selectDashboardLoading = createSelector(
  selectDashboardState,
  (state) => state.loading,
);

export const selectDashboardError = createSelector(
  selectDashboardState,
  (state) => state.error,
);

export const selectSelectedPeriod = createSelector(
  selectDashboardState,
  (state) => state.selectedPeriod,
);

export const selectKpis = createSelector(
  selectMetrics,
  (metrics) => metrics?.kpis ?? [],
);

export const selectRecentActivity = createSelector(
  selectMetrics,
  (metrics) => metrics?.recentActivity ?? [],
);
