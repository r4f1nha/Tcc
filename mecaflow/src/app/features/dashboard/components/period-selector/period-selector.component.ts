import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MetricPeriod } from '../../models/dashboard.model';

@Component({
  selector: 'app-period-selector',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center gap-1 bg-[#1a1d27] rounded-lg p-1">
      @for (option of periods; track option.value) {
        <button
          type="button"
          (click)="periodChanged.emit(option.value)"
          [class]="selected() === option.value
            ? 'bg-[#4F6EF7] text-white'
            : 'text-slate-400 hover:text-white'"
          class="px-4 py-2 rounded-md text-sm font-medium transition-all">
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
    { label: 'Hoje', value: MetricPeriod.TODAY },
    { label: 'Semana', value: MetricPeriod.WEEK },
    { label: 'Mês', value: MetricPeriod.MONTH },
  ];
}
