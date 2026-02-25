import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { KpiCard } from '../../models/dashboard.model';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-[#22263a] rounded-xl p-5 border border-slate-700/50 hover:border-[#4F6EF7]/30 transition-all">
      <div class="flex items-center justify-between mb-3">
        <span class="text-slate-400 text-sm font-medium">{{ kpi().label }}</span>
        <div class="w-10 h-10 rounded-lg bg-[#4F6EF7]/10 flex items-center justify-center">
          <span class="text-lg">{{ kpi().icon }}</span>
        </div>
      </div>
      <div class="text-2xl font-bold text-white mb-1">{{ kpi().formattedValue }}</div>
      <div class="flex items-center gap-1.5 text-xs">
        @if (kpi().trend === 'up') {
          <svg class="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd"/>
          </svg>
          <span class="text-emerald-400">+{{ kpi().percentageChange }}%</span>
        } @else if (kpi().trend === 'down') {
          <svg class="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clip-rule="evenodd"/>
          </svg>
          <span class="text-red-400">-{{ kpi().percentageChange }}%</span>
        } @else {
          <span class="text-slate-500">0%</span>
        }
        <span class="text-slate-500">vs período anterior</span>
      </div>
    </div>
  `,
})
export class KpiCardComponent {
  readonly kpi = input.required<KpiCard>();
}
