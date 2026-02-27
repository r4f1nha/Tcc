import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Message, MessageType } from '../../models/conversation.model';

@Component({
  selector: 'app-message-bubble',
  standalone: true,
  imports: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="d-flex mb-3" [class.justify-content-end]="!message().isFromLead">
      <div class="message-bubble"
        [class.bubble-incoming]="message().isFromLead"
        [class.bubble-outgoing]="!message().isFromLead">

        @if (message().isFromLead) {
          <p class="mb-1 font-weight-600" style="font-size:0.7rem;opacity:0.7;">{{ message().senderName }}</p>
        }

        @switch (message().type) {
          @case (MessageType.IMAGE) {
            <img [src]="message().mediaUrl" [alt]="'Imagem de ' + message().senderName"
              class="img-fluid rounded mb-1" style="max-width:200px;" loading="lazy" />
          }
          @case (MessageType.AUDIO) {
            <audio controls style="max-width:220px;">
              <source [src]="message().mediaUrl" />
            </audio>
          }
          @case (MessageType.DOCUMENT) {
            <a [href]="message().mediaUrl" target="_blank" rel="noopener noreferrer" class="d-flex align-items-center gap-1">
              <i class="fas fa-file-alt"></i> Documento
            </a>
          }
          @default {
            <p class="mb-0" style="font-size:0.85rem;white-space:pre-wrap;word-break:break-word;">{{ message().content }}</p>
          }
        }

        <small class="d-block mt-1 text-right" style="font-size:0.65rem;opacity:0.65;">
          {{ message().createdAt | date:'HH:mm' }}
        </small>
      </div>
    </div>
  `,
  styles: [`
    .message-bubble { max-width: 75%; padding: 0.5rem 0.9rem; border-radius: 12px; }
    .bubble-incoming { background: #f0f2f5; color: #333; border-bottom-left-radius: 4px; }
    .bubble-outgoing { background: #4F6EF7; color: #fff; border-bottom-right-radius: 4px; }
  `],
})
export class MessageBubbleComponent {
  readonly message = input.required<Message>();
  protected readonly MessageType = MessageType;
}
