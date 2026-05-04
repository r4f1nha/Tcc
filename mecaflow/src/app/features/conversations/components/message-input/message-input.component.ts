import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SendMessagePayload, MessageType } from '../../models/conversation.model';

type InputMode = 'REPLY' | 'NOTE';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="border-top" style="background:#fff;">
      @if (disabled()) {
        <div class="text-center text-muted py-3" style="font-size:0.82rem;">
          <i class="fas fa-lock mr-1"></i>Esta conversa está atribuída a outro agente
        </div>
      } @else {
        <!-- Tabs Responder / Nota Privada -->
        <div class="d-flex border-bottom px-2 pt-1">
          <button type="button" class="input-tab-btn mr-2"
            [class.input-tab-active]="mode() === 'REPLY'"
            (click)="mode.set('REPLY')">
            <i class="fas fa-reply" style="font-size:0.75rem;"></i> Responder
          </button>
          <button type="button" class="input-tab-btn"
            [class.input-tab-note]="mode() === 'NOTE'"
            (click)="mode.set('NOTE')">
            <i class="fas fa-lock" style="font-size:0.75rem;"></i> Nota Privada
          </button>
        </div>

        <form [formGroup]="messageForm" (ngSubmit)="onSend()" class="p-2">
          <textarea
            formControlName="content"
            [placeholder]="mode() === 'REPLY' ? 'Shift + Enter para nova linha...' : 'Escreva uma nota interna...'"
            rows="2"
            (keydown.enter)="onEnterPress($event)"
            (input)="onTyping()"
            class="form-control border-0 p-1"
            [style.background]="mode() === 'NOTE' ? '#fffbe6' : '#fff'"
            style="resize:none;font-size:0.85rem;outline:none;box-shadow:none;"
          ></textarea>

          <div class="d-flex align-items-center justify-content-between pt-1">
            <div class="text-muted" style="font-size:0.7rem;">
              @if (mode() === 'NOTE') {
                <span class="badge badge-warning text-dark">Nota interna — não enviada ao cliente</span>
              }
            </div>
            <button type="submit" class="btn btn-sm"
              [class.btn-primary]="mode() === 'REPLY'"
              [class.btn-warning]="mode() === 'NOTE'"
              [disabled]="messageForm.invalid"
              style="font-size:0.8rem;">
              <i class="fas fa-paper-plane mr-1"></i>Enviar
            </button>
          </div>
        </form>
      }
    </div>
  `,
  styles: [`
    .input-tab-btn {
      background: transparent;
      border: none;
      border-bottom: 2px solid transparent;
      padding: 4px 8px;
      font-size: 0.78rem;
      color: #6c757d;
      cursor: pointer;
      transition: all 0.15s;
    }
    .input-tab-btn:hover { color: #333; }
    .input-tab-active { color: #1F93FF !important; border-bottom-color: #1F93FF !important; font-weight: 600; }
    .input-tab-note { color: #e6a817 !important; border-bottom-color: #e6a817 !important; font-weight: 600; }
  `],
})
export class MessageInputComponent {
  private readonly fb = inject(FormBuilder);

  readonly conversationId = input.required<string>();
  readonly disabled = input(false);
  readonly messageSent = output<SendMessagePayload>();
  readonly typing = output<void>();

  readonly mode = signal<InputMode>('REPLY');

  readonly messageForm = this.fb.nonNullable.group({
    content: ['', [Validators.required, Validators.minLength(1)]],
  });

  onSend(): void {
    if (this.messageForm.valid && this.mode() === 'REPLY') {
      this.messageSent.emit({
        conversationId: this.conversationId(),
        content: this.messageForm.getRawValue().content.trim(),
        type: MessageType.TEXT,
      });
      this.messageForm.reset();
    } else if (this.messageForm.valid && this.mode() === 'NOTE') {
      this.messageForm.reset();
    }
  }

  onEnterPress(event: Event): void {
    const keyEvent = event as KeyboardEvent;
    if (!keyEvent.shiftKey) {
      keyEvent.preventDefault();
      this.onSend();
    }
  }

  onTyping(): void {
    this.typing.emit();
  }
}
