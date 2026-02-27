import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgClass } from '@angular/common';
import { Conversation, ConversationStatus } from '../../models/conversation.model';

@Component({
  selector: 'app-conversation-header',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="d-flex align-items-center justify-content-between px-3 py-2 border-bottom bg-white">
      <div class="d-flex align-items-center gap-2">
        <div class="d-flex align-items-center justify-content-center rounded-circle font-weight-600 mr-2"
          style="width:38px;height:38px;background:rgba(79,110,247,0.12);color:#4F6EF7;font-size:13px;flex-shrink:0;">
          {{ getInitials(conversation().leadName) }}
        </div>
        <div>
          <h6 class="mb-0 font-weight-600" style="font-size:0.9rem;">{{ conversation().leadName }}</h6>
          <small class="text-muted">{{ conversation().leadPhone }}</small>
        </div>
        <span class="badge badge-pill ml-2" [ngClass]="statusBadgeClass">{{ statusLabel }}</span>
      </div>
      <div class="d-flex align-items-center gap-2">
        @if (canAssign) {
          <button type="button" class="btn btn-sm btn-outline-success" (click)="assignClicked.emit()">
            <i class="fas fa-hand-paper mr-1"></i>Assumir
          </button>
        }
        <button type="button" class="btn btn-sm btn-outline-secondary" (click)="transferClicked.emit()">
          <i class="fas fa-share mr-1"></i>Transferir
        </button>
        @if (conversation().status !== ConversationStatus.RESOLVED) {
          <button type="button" class="btn btn-sm btn-outline-primary" (click)="resolveClicked.emit()">
            <i class="fas fa-check mr-1"></i>Resolver
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
      [ConversationStatus.BOT]: 'badge-danger',
      [ConversationStatus.HUMAN]: 'badge-success',
      [ConversationStatus.UNASSIGNED]: 'badge-warning',
      [ConversationStatus.RESOLVED]: 'badge-secondary',
    };
    return classes[this.conversation().status];
  }

  getInitials(name: string): string {
    return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
  }
}
