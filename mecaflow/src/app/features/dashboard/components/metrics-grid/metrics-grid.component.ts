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
    <div class="row">
      @if (loading()) {
        @for (i of skeletonItems; track i) {
          <div class="col-md-4 col-sm-6 mb-3">
            <app-skeleton variant="card" />
          </div>
        }
      } @else {
        @for (kpi of kpis(); track kpi.id) {
          <div class="col-md-4 col-sm-6 mb-3">
            <app-kpi-card [kpi]="kpi" />
          </div>
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
