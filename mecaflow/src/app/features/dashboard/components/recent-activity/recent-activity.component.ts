import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { ActivityItem } from '../../models/dashboard.model';
import { TimeAgoPipe } from '../../../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-recent-activity',
  standalone: true,
  imports: [TimeAgoPipe, NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card h-100">
      <div class="card-header">
        <h6 class="card-title">
          <i class="fas fa-history"></i> Atividades Recentes
        </h6>
      </div>
      <div class="card-body p-0">
        <ul class="list-group list-group-flush">
          @for (activity of activities(); track activity.id) {
            <li class="list-group-item d-flex align-items-start py-3">
              <div class="mr-3 mt-1">
                <span class="badge badge-pill" [ngClass]="getActivityBadge(activity.type)" style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:50%;">
                  <i class="fas" [ngClass]="getActivityIcon(activity.type)" style="font-size:12px;"></i>
                </span>
              </div>
              <div class="flex-grow-1 min-w-0">
                <p class="mb-0 font-weight-600" style="font-size:0.85rem;">{{ activity.title }}</p>
                <small class="text-muted">{{ activity.description }}</small>
              </div>
              <small class="text-muted ml-2 text-nowrap">{{ activity.timestamp | timeAgo }}</small>
            </li>
          } @empty {
            <li class="list-group-item text-center py-4 text-muted">
              <i class="fas fa-inbox mb-2 d-block" style="font-size:1.5rem;opacity:0.4;"></i>
              Nenhuma atividade recente
            </li>
          }
        </ul>
      </div>
    </div>
  `,
})
export class RecentActivityComponent {
  readonly activities = input.required<ReadonlyArray<ActivityItem>>();

  getActivityBadge(type: ActivityItem['type']): string {
    const badges: Record<ActivityItem['type'], string> = {
      order_created:    'badge-primary',
      order_completed:  'badge-success',
      client_added:     'badge-info',
      payment_received: 'badge-warning',
      status_changed:   'badge-secondary',
    };
    return badges[type];
  }

  getActivityIcon(type: ActivityItem['type']): string {
    const icons: Record<ActivityItem['type'], string> = {
      order_created:    'fa-tools',
      order_completed:  'fa-check',
      client_added:     'fa-user-plus',
      payment_received: 'fa-dollar-sign',
      status_changed:   'fa-sync',
    };
    return icons[type];
  }
}
