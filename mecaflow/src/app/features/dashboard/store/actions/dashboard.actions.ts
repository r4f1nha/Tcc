import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { DashboardMetrics, MetricPeriod } from '../../models/dashboard.model';

export const DashboardActions = createActionGroup({
  source: 'Dashboard',
  events: {
    'Load Metrics': props<{ period: MetricPeriod }>(),
    'Load Metrics Success': props<{ metrics: DashboardMetrics }>(),
    'Load Metrics Failure': props<{ error: string }>(),
    'Change Period': props<{ period: MetricPeriod }>(),
    'Refresh': emptyProps(),
  },
});
