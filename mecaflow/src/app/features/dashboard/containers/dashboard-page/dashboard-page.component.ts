import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MetricPeriod } from '../../models/dashboard.model';
import { DashboardActions } from '../../store/actions/dashboard.actions';
import {
  selectDashboardLoading,
  selectKpis,
  selectRecentActivity,
  selectSelectedPeriod,
} from '../../store/selectors/dashboard.selectors';
import { MetricsGridComponent } from '../../components/metrics-grid/metrics-grid.component';
import { PeriodSelectorComponent } from '../../components/period-selector/period-selector.component';
import { RecentActivityComponent } from '../../components/recent-activity/recent-activity.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [MetricsGridComponent, PeriodSelectorComponent, RecentActivityComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-6 space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white">Dashboard</h1>
          <p class="text-sm text-slate-400 mt-1">Visão geral da sua oficina</p>
        </div>
        <app-period-selector
          [selected]="selectedPeriod()"
          (periodChanged)="onPeriodChanged($event)"
        />
      </div>

      <!-- KPIs -->
      <app-metrics-grid [kpis]="kpis()" [loading]="loading()" />

      <!-- Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <app-recent-activity [activities]="recentActivity()" />
      </div>
    </div>
  `,
})
export class DashboardPageComponent implements OnInit {
  private readonly store = inject(Store);

  readonly kpis = this.store.selectSignal(selectKpis);
  readonly loading = this.store.selectSignal(selectDashboardLoading);
  readonly selectedPeriod = this.store.selectSignal(selectSelectedPeriod);
  readonly recentActivity = this.store.selectSignal(selectRecentActivity);

  ngOnInit(): void {
    this.store.dispatch(
      DashboardActions.loadMetrics({ period: this.selectedPeriod() }),
    );
  }

  onPeriodChanged(period: MetricPeriod): void {
    this.store.dispatch(DashboardActions.changePeriod({ period }));
  }
}
