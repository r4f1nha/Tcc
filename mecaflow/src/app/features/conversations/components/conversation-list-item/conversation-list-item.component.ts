import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Conversation, ConversationStatus } from '../../models/conversation.model';
import { TimeAgoPipe } from '../../../../shared/pipes/time-ago.pipe';
import { TruncatePipe } from '../../../../shared/pipes/truncate.pipe';

@Component({
  selector: 'app-conversation-list-item',
  standalone: true,
  imports: [TimeAgoPipe, TruncatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      (click)="selected.emit(conversation().id)"
      class="w-100 d-flex align-items-start p-3 border-0 text-left conv-item"
      [class.conv-item-active]="isActive()"
    >
      <!-- Avatar -->
      <div class="position-relative mr-3 flex-shrink-0">
        <div class="avatar-circle d-flex align-items-center justify-content-center rounded-circle font-weight-bold">
          {{ getInitials(conversation().leadName) }}
        </div>
        <span class="status-dot position-absolute rounded-circle border border-white"
          [style.background]="statusColor"></span>
      </div>

      <!-- Conteúdo -->
      <div class="flex-grow-1 min-w-0">
        <div class="d-flex align-items-center justify-content-between mb-1">
          <span class="font-weight-600 text-truncate" style="font-size:0.83rem;color:#1a1a2e;max-width:150px;">
            {{ conversation().leadName || 'Desconhecido' }}
          </span>
          <small class="text-muted text-nowrap ml-1" style="font-size:0.7rem;">
            {{ conversation().lastMessageAt | timeAgo }}
          </small>
        </div>

        <p class="mb-1 text-truncate" style="font-size:0.75rem;color:#6c757d;">
          {{ conversation().lastMessage | truncate:45 }}
        </p>

        @if (conversation().labels && conversation().labels.length > 0) {
          <div class="d-flex flex-wrap gap-1">
            @for (label of conversation().labels; track label.id) {
              <span class="label-badge"
                [style.background-color]="label.color + '22'"
                [style.color]="label.color"
                [style.border-color]="label.color + '55'">
                {{ label.name }}
              </span>
            }
          </div>
        }
      </div>

      <!-- Unread badge -->
      @if (conversation().unreadCount > 0) {
        <span class="badge badge-pill ml-2 align-self-start mt-1"
          style="background:#1F93FF;color:#fff;font-size:0.65rem;min-width:18px;">
          {{ conversation().unreadCount }}
        </span>
      }
    </button>
  `,
  styles: [`
    .conv-item {
      background: transparent;
      border-left: 2px solid transparent !important;
      cursor: pointer;
      transition: all 0.12s;
      border-bottom: 1px solid #f0f0f0 !important;
    }
    .conv-item:hover { background: #f5f7ff !important; }
    .conv-item-active {
      background: #EBF2FF !important;
      border-left-color: #1F93FF !important;
    }
    .avatar-circle {
      width: 36px; height: 36px;
      background: #dde5ff; color: #3B5BDB;
      font-size: 12px; flex-shrink: 0;
    }
    .status-dot { width: 9px; height: 9px; bottom: -1px; right: -1px; }
    .label-badge {
      font-size: 0.6rem;
      padding: 1px 6px;
      border-radius: 10px;
      border: 1px solid;
      font-weight: 500;
    }
  `],
})
export class ConversationListItemComponent {
  readonly conversation = input.required<Conversation>();
  readonly isActive = input(false);
  readonly selected = output<string>();

  get statusColor(): string {
    const map: Record<ConversationStatus, string> = {
      [ConversationStatus.HUMAN]: '#40C057',
      [ConversationStatus.BOT]: '#FA5252',
      [ConversationStatus.UNASSIGNED]: '#FD7E14',
      [ConversationStatus.RESOLVED]: '#adb5bd',
    };
    return map[this.conversation().status] ?? '#adb5bd';
  }

  getInitials(name: string): string {
    return (name || '?')
      .split(' ')
      .slice(0, 2)
      .map((n) => n?.[0] ?? '')
      .join('')
      .toUpperCase() || '?';
  }
}
