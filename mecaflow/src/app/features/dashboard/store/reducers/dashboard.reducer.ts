import { createReducer, on } from '@ngrx/store';
import { DashboardMetrics, MetricPeriod } from '../../models/dashboard.model';
import { DashboardActions } from '../actions/dashboard.actions';

export interface DashboardState {
  readonly metrics: DashboardMetrics | null;
  readonly selectedPeriod: MetricPeriod;
  readonly loading: boolean;
  readonly error: string | null;
}

const initialState: DashboardState = {
  metrics: null,
  selectedPeriod: MetricPeriod.TODAY,
  loading: false,
  error: null,
};

export const dashboardReducer = createReducer(
  initialState,
  on(DashboardActions.loadMetrics, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(DashboardActions.loadMetricsSuccess, (state, { metrics }) => ({
    ...state,
    metrics,
    loading: false,
  })),
  on(DashboardActions.loadMetricsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(DashboardActions.changePeriod, (state, { period }) => ({
    ...state,
    selectedPeriod: period,
  })),
);
