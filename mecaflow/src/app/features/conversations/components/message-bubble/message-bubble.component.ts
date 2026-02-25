import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Message, MessageType } from '../../models/conversation.model';

@Component({
  selector: 'app-message-bubble',
  standalone: true,
  imports: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="flex mb-3"
      [class]="message().isFromLead ? 'justify-start' : 'justify-end'">
      <div
        class="max-w-[75%] rounded-2xl px-4 py-2.5"
        [class]="message().isFromLead
          ? 'bg-[#1a1d27] text-white rounded-bl-sm'
          : 'bg-[#4F6EF7] text-white rounded-br-sm'">

        @if (message().isFromLead) {
          <p class="text-xs font-medium text-slate-400 mb-1">{{ message().senderName }}</p>
        }

        @switch (message().type) {
          @case (MessageType.IMAGE) {
            <img
              [src]="message().mediaUrl"
              [alt]="'Imagem de ' + message().senderName"
              class="rounded-lg max-w-full h-auto mb-1"
              loading="lazy"
            />
          }
          @case (MessageType.AUDIO) {
            <audio controls class="max-w-full">
              <source [src]="message().mediaUrl" />
            </audio>
          }
          @case (MessageType.DOCUMENT) {
            <a
              [href]="message().mediaUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 text-sm underline">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/>
              </svg>
              Documento
            </a>
          }
          @default {
            <p class="text-sm whitespace-pre-wrap break-words">{{ message().content }}</p>
          }
        }

        <p class="text-[10px] mt-1 font-mono"
          [class]="message().isFromLead ? 'text-slate-500' : 'text-blue-200'">
          {{ message().createdAt | date:'HH:mm' }}
        </p>
      </div>
    </div>
  `,
})
export class MessageBubbleComponent {
  readonly message = input.required<Message>();
  protected readonly MessageType = MessageType;
}
