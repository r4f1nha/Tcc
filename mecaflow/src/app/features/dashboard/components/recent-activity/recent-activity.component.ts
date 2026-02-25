import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ActivityItem } from '../../models/dashboard.model';
import { TimeAgoPipe } from '../../../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-recent-activity',
  standalone: true,
  imports: [TimeAgoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-[#22263a] rounded-xl border border-slate-700/50 p-5">
      <h3 class="text-white font-semibold mb-4">Atividades recentes</h3>
      <div class="space-y-4">
        @for (activity of activities(); track activity.id) {
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
              [class]="getActivityColor(activity.type)">
              {{ getActivityIcon(activity.type) }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-white">{{ activity.title }}</p>
              <p class="text-xs text-slate-400 truncate">{{ activity.description }}</p>
            </div>
            <span class="text-xs text-slate-500 font-mono shrink-0">
              {{ activity.timestamp | timeAgo }}
            </span>
          </div>
        } @empty {
          <p class="text-sm text-slate-500 text-center py-4">Nenhuma atividade recente</p>
        }
      </div>
    </div>
  `,
})
export class RecentActivityComponent {
  readonly activities = input.required<ReadonlyArray<ActivityItem>>();

  getActivityIcon(type: ActivityItem['type']): string {
    const icons: Record<ActivityItem['type'], string> = {
      order_created: '🔧',
      order_completed: '✅',
      client_added: '👤',
      payment_received: '💰',
      status_changed: '🔄',
    };
    return icons[type];
  }

  getActivityColor(type: ActivityItem['type']): string {
    const colors: Record<ActivityItem['type'], string> = {
      order_created: 'bg-blue-500/20',
      order_completed: 'bg-emerald-500/20',
      client_added: 'bg-purple-500/20',
      payment_received: 'bg-amber-500/20',
      status_changed: 'bg-slate-500/20',
    };
    return colors[type];
  }
}
