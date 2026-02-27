import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SendMessagePayload, MessageType } from '../../models/conversation.model';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="border-top p-2" style="background:#f8f9fa;">
      @if (disabled()) {
        <div class="text-center text-muted py-2" style="font-size:0.85rem;">
          Esta conversa está atribuída a outro agente
        </div>
      } @else {
        <form [formGroup]="messageForm" (ngSubmit)="onSend()">
          <div class="input-group input-group-sm">
            <textarea
              formControlName="content"
              placeholder="Digite sua mensagem..."
              rows="1"
              (keydown.enter)="onEnterPress($event)"
              (input)="onTyping()"
              class="form-control"
              style="resize:none;"
            ></textarea>
            <div class="input-group-append">
              <button type="submit" class="btn btn-primary" [disabled]="messageForm.invalid">
                <i class="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </form>
      }
    </div>
  `,
})
export class MessageInputComponent {
  private readonly fb = inject(FormBuilder);

  readonly conversationId = input.required<string>();
  readonly disabled = input(false);

  readonly messageSent = output<SendMessagePayload>();
  readonly typing = output<void>();

  readonly messageForm = this.fb.nonNullable.group({
    content: ['', [Validators.required, Validators.minLength(1)]],
  });

  onSend(): void {
    if (this.messageForm.valid) {
      this.messageSent.emit({
        conversationId: this.conversationId(),
        content: this.messageForm.getRawValue().content.trim(),
        type: MessageType.TEXT,
      });
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
