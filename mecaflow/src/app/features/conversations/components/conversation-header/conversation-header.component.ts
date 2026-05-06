import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { Conversation, ConversationStatus } from '../../models/conversation.model';

@Component({
  selector: 'app-conversation-header',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="d-flex align-items-center justify-content-between px-3 py-2 border-bottom bg-white">
      <div class="d-flex align-items-center">
        <div class="avatar-circle d-flex align-items-center justify-content-center rounded-circle font-weight-bold mr-2 flex-shrink-0">
          {{ getInitials(conversation().leadName) }}
        </div>
        <div>
          <div class="d-flex align-items-center gap-2">
            <span class="font-weight-600" style="font-size:0.9rem;color:#1a1a2e;">
              {{ conversation().leadName }}
            </span>
            <span class="status-pill" [ngClass]="statusPillClass">{{ statusLabel }}</span>
          </div>
          <small class="text-muted" style="font-size:0.72rem;">
            @if (conversation().assignedAgentName) {
              <i class="fas fa-user-circle"></i> {{ conversation().assignedAgentName }}
            }
          </small>
        </div>
      </div>

      <div class="d-flex align-items-center gap-2">
        @if (canAssign) {
          <button type="button" class="btn btn-sm btn-outline-primary" (click)="assignClicked.emit()">
            <i class="fas fa-hand-paper mr-1"></i>Assumir
          </button>
        }
        @if (conversation().status !== ConversationStatus.RESOLVED) {
          <button type="button" class="btn btn-sm btn-success text-white" (click)="resolveClicked.emit()">
            <i class="fas fa-check mr-1"></i>Resolver
          </button>
        }

        <!-- Mais opções dropdown -->
        <div class="position-relative">
          <button type="button" class="btn btn-sm btn-light" style="color:#6c757d;"
            (click)="onMenuToggle($event)" title="Mais opções">
            <i class="fas fa-ellipsis-v"></i>
          </button>
          @if (menuOpen() && menuAnchor(); as anchor) {
            <!-- overlay para fechar o menu -->
            <div style="position:fixed;inset:0;z-index:1998;" (click)="menuOpen.set(false)"></div>
            <div class="dropdown-menu show"
              [style.position]="'fixed'"
              [style.top.px]="anchor.top"
              [style.left.px]="anchor.left"
              style="min-width:170px;z-index:1999;box-shadow:0 4px 16px rgba(0,0,0,0.15);">
              @if (conversation().status === ConversationStatus.RESOLVED) {
                <button type="button" class="dropdown-item" (click)="onReopen()">
                  <i class="fas fa-redo mr-2 text-primary"></i>Reabrir
                </button>
              }
              @if (conversation().status !== ConversationStatus.RESOLVED) {
                <button type="button" class="dropdown-item" (click)="onTransfer()">
                  <i class="fas fa-exchange-alt mr-2 text-secondary"></i>Transferir
                </button>
              }
              @if (conversation().status !== ConversationStatus.RESOLVED) {
                <div class="dropdown-divider"></div>
                @if (conversation().status === ConversationStatus.BOT) {
                  <button type="button" class="dropdown-item" (click)="onBotToggle()">
                    <i class="fas fa-robot mr-2" style="color:#c92a2a;"></i>Pausar bot
                  </button>
                } @else {
                  <button type="button" class="dropdown-item" (click)="onBotToggle()">
                    <i class="fas fa-robot mr-2" style="color:#2f9e44;"></i>Ativar bot
                  </button>
                }
              }
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .avatar-circle {
      width: 36px; height: 36px;
      background: #dde5ff; color: #3B5BDB;
      font-size: 13px;
    }
    .status-pill {
      font-size: 0.65rem;
      padding: 2px 8px;
      border-radius: 20px;
      font-weight: 600;
    }
    .pill-human { background: #d3f9d8; color: #2f9e44; }
    .pill-bot { background: #ffe3e3; color: #c92a2a; }
    .pill-unassigned { background: #fff3bf; color: #e67700; }
    .pill-resolved { background: #e9ecef; color: #6c757d; }
    .dropdown-item { font-size: 0.82rem; cursor: pointer; }
    .dropdown-item:hover { background: #f5f7ff; }
  `],
})
export class ConversationHeaderComponent {
  readonly conversation = input.required<Conversation>();
  readonly assignClicked = output<void>();
  readonly transferClicked = output<void>();
  readonly resolveClicked = output<void>();
  readonly reopenClicked = output<void>();
  readonly botToggleClicked = output<void>();

  protected readonly ConversationStatus = ConversationStatus;
  readonly menuOpen = signal(false);
  readonly menuAnchor = signal<{ top: number; left: number } | null>(null);

  get canAssign(): boolean {
    const s = this.conversation().status;
    return s === ConversationStatus.BOT || s === ConversationStatus.UNASSIGNED;
  }

  get statusLabel(): string {
    const map: Record<ConversationStatus, string> = {
      [ConversationStatus.BOT]: 'Bot',
      [ConversationStatus.HUMAN]: 'Em atendimento',
      [ConversationStatus.UNASSIGNED]: 'Não atribuída',
      [ConversationStatus.RESOLVED]: 'Resolvida',
    };
    return map[this.conversation().status];
  }

  get statusPillClass(): string {
    const map: Record<ConversationStatus, string> = {
      [ConversationStatus.BOT]: 'pill-bot',
      [ConversationStatus.HUMAN]: 'pill-human',
      [ConversationStatus.UNASSIGNED]: 'pill-unassigned',
      [ConversationStatus.RESOLVED]: 'pill-resolved',
    };
    return map[this.conversation().status];
  }

  getInitials(name: string): string {
    return (name || '?').split(' ').slice(0, 2).map((n) => n?.[0] ?? '').join('').toUpperCase() || '?';
  }

  onMenuToggle(event: MouseEvent): void {
    const btn = event.currentTarget as HTMLElement;
    const rect = btn.getBoundingClientRect();
    const dropdownWidth = 170;
    const left = Math.max(8, Math.min(rect.right - dropdownWidth, window.innerWidth - dropdownWidth - 8));
    this.menuAnchor.set({ top: rect.bottom + 4, left });
    this.menuOpen.set(!this.menuOpen());
  }

  onReopen(): void {
    this.menuOpen.set(false);
    this.reopenClicked.emit();
  }

  onTransfer(): void {
    this.menuOpen.set(false);
    this.transferClicked.emit();
  }

  onBotToggle(): void {
    this.menuOpen.set(false);
    this.botToggleClicked.emit();
  }
}
