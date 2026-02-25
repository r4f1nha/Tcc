export enum MetricPeriod {
  TODAY = 'TODAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
}

export interface KpiCard {
  id: string;
  label: string;
  value: number;
  formattedValue: string;
  trend: 'up' | 'down' | 'neutral';
  percentageChange: number;
  icon: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface ChartData {
  id: string;
  title: string;
  type: 'line' | 'bar' | 'pie';
  dataPoints: ReadonlyArray<ChartDataPoint>;
  color: string;
}

export interface ActivityItem {
  id: string;
  type: 'order_created' | 'order_completed' | 'client_added' | 'payment_received' | 'status_changed';
  title: string;
  description: string;
  timestamp: string;
  actorName: string;
}

export interface DashboardMetrics {
  kpis: ReadonlyArray<KpiCard>;
  charts: ReadonlyArray<ChartData>;
  recentActivity: ReadonlyArray<ActivityItem>;
}
