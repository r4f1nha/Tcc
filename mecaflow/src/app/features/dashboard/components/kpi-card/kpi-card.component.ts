import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { KpiCard } from '../../models/dashboard.model';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card h-100">
      <div class="card-body">
        <div class="d-flex align-items-center justify-content-between mb-2">
          <small class="text-muted text-uppercase font-weight-600" style="font-size:0.7rem; letter-spacing:0.8px;">{{ kpi().label }}</small>
        </div>
        <h4 class="font-weight-700 mb-1" style="color:#1a1d27;">{{ kpi().formattedValue }}</h4>
        <div class="d-flex align-items-center" style="font-size:0.75rem;">
          @if (kpi().trend === 'up') {
            <i class="fas fa-arrow-up text-success mr-1"></i>
            <span class="text-success font-weight-600">+{{ kpi().percentageChange }}%</span>
          } @else if (kpi().trend === 'down') {
            <i class="fas fa-arrow-down text-danger mr-1"></i>
            <span class="text-danger font-weight-600">-{{ kpi().percentageChange }}%</span>
          } @else {
            <i class="fas fa-minus text-muted mr-1"></i>
            <span class="text-muted">0%</span>
          }
          <span class="text-muted ml-1">vs período anterior</span>
        </div>
      </div>
    </div>
  `,
})
export class KpiCardComponent {
  readonly kpi = input.required<KpiCard>();
}
