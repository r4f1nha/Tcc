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
      style="background:transparent; border-left: 3px solid transparent; cursor:pointer; transition:all 0.15s;">
      <!-- Avatar -->
      <div class="position-relative mr-3 flex-shrink-0">
        <div class="d-flex align-items-center justify-content-center rounded-circle font-weight-600"
          style="width:38px;height:38px;background:rgba(79,110,247,0.12);color:#4F6EF7;font-size:13px;">
          {{ getInitials(conversation().leadName) }}
        </div>
        <span class="position-absolute rounded-circle border border-white"
          [style.background]="statusDotColor"
          style="width:10px;height:10px;bottom:-1px;right:-1px;"></span>
      </div>

      <!-- Conteúdo -->
      <div class="flex-grow-1 min-w-0">
        <div class="d-flex align-items-center justify-content-between mb-1">
          <span class="font-weight-600 text-truncate" style="font-size:0.83rem;color:#333;">
            {{ conversation().leadName }}
          </span>
          <small class="text-muted text-nowrap ml-2">{{ conversation().lastMessageAt | timeAgo }}</small>
        </div>
        <p class="text-muted mb-0 text-truncate" style="font-size:0.78rem;">
          {{ conversation().lastMessage | truncate:50 }}
        </p>
      </div>

      <!-- Badge não lido -->
      @if (conversation().unreadCount > 0) {
        <span class="badge badge-pill badge-primary ml-2 align-self-center" style="font-size:0.65rem;">
          {{ conversation().unreadCount }}
        </span>
      }
    </button>
  `,
  styles: [`
    .conv-item:hover { background: #f8f9fc !important; border-left-color: #4F6EF7 !important; }
    .conv-item-active { background: rgba(79,110,247,0.06) !important; border-left-color: #4F6EF7 !important; }
  `],
})
export class ConversationListItemComponent {
  readonly conversation = input.required<Conversation>();
  readonly isActive = input(false);
  readonly selected = output<string>();

  get statusDotColor(): string {
    const colorMap: Record<ConversationStatus, string> = {
      [ConversationStatus.HUMAN]: '#28C76F',
      [ConversationStatus.BOT]: '#EA5455',
      [ConversationStatus.UNASSIGNED]: '#FF9F43',
      [ConversationStatus.RESOLVED]: '#aaa',
    };
    return colorMap[this.conversation().status];
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }
}
