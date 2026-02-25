import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Conversation, ConversationStatus } from '../../models/conversation.model';

@Component({
  selector: 'app-conversation-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center justify-between px-4 py-3 border-b border-slate-700/50 bg-[#1a1d27]">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-[#4F6EF7]/20 flex items-center justify-center text-sm font-semibold text-[#4F6EF7]">
          {{ getInitials(conversation().leadName) }}
        </div>
        <div>
          <h3 class="text-sm font-semibold text-white">{{ conversation().leadName }}</h3>
          <p class="text-xs text-slate-400">{{ conversation().leadPhone }}</p>
        </div>
        <span class="text-xs px-2 py-0.5 rounded-full font-medium"
          [class]="statusBadgeClass">
          {{ statusLabel }}
        </span>
      </div>
      <div class="flex items-center gap-2">
        @if (canAssign) {
          <button
            type="button"
            (click)="assignClicked.emit()"
            class="text-xs px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors">
            Assumir
          </button>
        }
        <button
          type="button"
          (click)="transferClicked.emit()"
          class="text-xs px-3 py-1.5 bg-slate-600/30 text-slate-300 rounded-lg hover:bg-slate-600/50 transition-colors">
          Transferir
        </button>
        @if (conversation().status !== ConversationStatus.RESOLVED) {
          <button
            type="button"
            (click)="resolveClicked.emit()"
            class="text-xs px-3 py-1.5 bg-[#4F6EF7]/10 text-[#4F6EF7] rounded-lg hover:bg-[#4F6EF7]/20 transition-colors">
            Resolver
          </button>
        }
      </div>
    </div>
  `,
})
export class ConversationHeaderComponent {
  readonly conversation = input.required<Conversation>();
  readonly assignClicked = output<void>();
  readonly transferClicked = output<void>();
  readonly resolveClicked = output<void>();

  protected readonly ConversationStatus = ConversationStatus;

  get canAssign(): boolean {
    const status = this.conversation().status;
    return (
      status === ConversationStatus.BOT ||
      status === ConversationStatus.UNASSIGNED
    );
  }

  get statusLabel(): string {
    const labels: Record<ConversationStatus, string> = {
      [ConversationStatus.BOT]: 'Bot',
      [ConversationStatus.HUMAN]: 'Humano',
      [ConversationStatus.UNASSIGNED]: 'Não atribuída',
      [ConversationStatus.RESOLVED]: 'Resolvida',
    };
    return labels[this.conversation().status];
  }

  get statusBadgeClass(): string {
    const classes: Record<ConversationStatus, string> = {
      [ConversationStatus.BOT]: 'bg-red-500/10 text-red-400',
      [ConversationStatus.HUMAN]: 'bg-emerald-500/10 text-emerald-400',
      [ConversationStatus.UNASSIGNED]: 'bg-amber-500/10 text-amber-400',
      [ConversationStatus.RESOLVED]: 'bg-slate-500/10 text-slate-400',
    };
    return classes[this.conversation().status];
  }

  getInitials(name: string): string {
    return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
  }
}
