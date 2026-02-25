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
      [class]="isActive() ? 'bg-[#4F6EF7]/10 border-l-2 border-l-[#4F6EF7]' : 'border-l-2 border-l-transparent hover:bg-[#1a1d27]'"
      class="w-full flex items-start gap-3 p-3 transition-all text-left">
      <!-- Avatar -->
      <div class="relative shrink-0">
        <div class="w-10 h-10 rounded-full bg-[#4F6EF7]/20 flex items-center justify-center text-sm font-semibold text-[#4F6EF7]">
          {{ getInitials(conversation().leadName) }}
        </div>
        <div
          class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#22263a]"
          [class]="statusDotColor">
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between mb-0.5">
          <span class="text-sm font-medium text-white truncate">{{ conversation().leadName }}</span>
          <span class="text-xs text-slate-500 font-mono shrink-0">
            {{ conversation().lastMessageAt | timeAgo }}
          </span>
        </div>
        <p class="text-xs text-slate-400 truncate">
          {{ conversation().lastMessage | truncate:50 }}
        </p>
      </div>

      <!-- Unread -->
      @if (conversation().unreadCount > 0) {
        <span class="bg-[#4F6EF7] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shrink-0">
          {{ conversation().unreadCount }}
        </span>
      }
    </button>
  `,
})
export class ConversationListItemComponent {
  readonly conversation = input.required<Conversation>();
  readonly isActive = input(false);
  readonly selected = output<string>();

  get statusDotColor(): string {
    const colorMap: Record<ConversationStatus, string> = {
      [ConversationStatus.HUMAN]: 'bg-emerald-500',
      [ConversationStatus.BOT]: 'bg-red-500',
      [ConversationStatus.UNASSIGNED]: 'bg-amber-500',
      [ConversationStatus.RESOLVED]: 'bg-slate-500',
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
