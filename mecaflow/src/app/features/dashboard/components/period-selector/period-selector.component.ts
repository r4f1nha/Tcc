import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgClass } from '@angular/common';
import { MetricPeriod } from '../../models/dashboard.model';

@Component({
  selector: 'app-period-selector',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="btn-group" role="group">
      @for (option of periods; track option.value) {
        <button
          type="button"
          class="btn btn-sm"
          [ngClass]="selected() === option.value ? 'btn-primary' : 'btn-outline-secondary'"
          (click)="periodChanged.emit(option.value)">
          {{ option.label }}
        </button>
      }
    </div>
  `,
})
export class PeriodSelectorComponent {
  readonly selected = input.required<MetricPeriod>();
  readonly periodChanged = output<MetricPeriod>();

  readonly periods: ReadonlyArray<{ label: string; value: MetricPeriod }> = [
    { label: 'Hoje',   value: MetricPeriod.TODAY },
    { label: 'Semana', value: MetricPeriod.WEEK },
    { label: 'Mês',    value: MetricPeriod.MONTH },
  ];
}
