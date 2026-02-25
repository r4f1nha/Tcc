import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { KpiCard } from '../../models/dashboard.model';
import { KpiCardComponent } from '../kpi-card/kpi-card.component';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-metrics-grid',
  standalone: true,
  imports: [KpiCardComponent, SkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      @if (loading()) {
        @for (i of skeletonItems; track i) {
          <app-skeleton variant="card" />
        }
      } @else {
        @for (kpi of kpis(); track kpi.id) {
          <app-kpi-card [kpi]="kpi" />
        }
      }
    </div>
  `,
})
export class MetricsGridComponent {
  readonly kpis = input.required<ReadonlyArray<KpiCard>>();
  readonly loading = input(false);
  readonly skeletonItems = [1, 2, 3, 4, 5, 6];
}
