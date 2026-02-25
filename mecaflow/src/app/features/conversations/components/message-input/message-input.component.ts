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
    <div class="border-t border-slate-700/50 p-3 bg-[#1a1d27]">
      @if (disabled()) {
        <div class="text-center text-sm text-slate-500 py-2">
          Esta conversa está atribuída a outro agente
        </div>
      } @else {
        <form [formGroup]="messageForm" (ngSubmit)="onSend()" class="flex items-end gap-2">
          <div class="flex-1 relative">
            <textarea
              formControlName="content"
              placeholder="Digite sua mensagem..."
              rows="1"
              (keydown.enter)="onEnterPress($event)"
              (input)="onTyping()"
              class="w-full px-4 py-2.5 bg-[#22263a] border border-slate-600/50 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#4F6EF7] resize-none"
            ></textarea>
          </div>
          <button
            type="submit"
            [disabled]="messageForm.invalid"
            class="p-2.5 bg-[#4F6EF7] hover:bg-[#3d5ae0] rounded-xl text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
            </svg>
          </button>
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
