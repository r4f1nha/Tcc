import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Store } from '@ngrx/store';
import { ConversationActions } from '../../store/actions/conversation.actions';
import {
  selectMessages,
  selectMessagesLoading,
  selectSelectedConversation,
  selectTypingIndicators,
} from '../../store/selectors/conversation.selectors';
import { SendMessagePayload } from '../../models/conversation.model';
import { ConversationHeaderComponent } from '../../components/conversation-header/conversation-header.component';
import { MessageBubbleComponent } from '../../components/message-bubble/message-bubble.component';
import { MessageInputComponent } from '../../components/message-input/message-input.component';

@Component({
  selector: 'app-conversation-detail',
  standalone: true,
  imports: [
    ScrollingModule,
    ConversationHeaderComponent,
    MessageBubbleComponent,
    MessageInputComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (conversation(); as conv) {
      <div class="d-flex flex-column h-100">
        <!-- Header -->
        <app-conversation-header
          [conversation]="conv"
          (assignClicked)="onAssign()"
          (transferClicked)="onTransfer()"
          (resolveClicked)="onResolve()"
        />

        <!-- Messages -->
        <div class="flex-grow-1 p-3" style="overflow-y:auto; min-height:0;">
          @if (messagesLoading()) {
            <div class="text-center py-3">
              <div class="spinner-border spinner-border-sm text-primary" role="status">
                <span class="sr-only">Carregando...</span>
              </div>
            </div>
          }
          @for (message of messages(); track message.id) {
            <app-message-bubble [message]="message" />
          }
          @if (typingIndicators().length > 0) {
            <div class="d-flex align-items-center text-muted px-3 py-2" style="font-size:0.75rem;">
              <span class="mr-2">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
              </span>
              {{ typingIndicators()[0].userName }} está digitando...
            </div>
          }
        </div>

        <!-- Input -->
        <app-message-input
          [conversationId]="conv.id"
          [disabled]="isLockedForCurrentAgent()"
          (messageSent)="onSendMessage($event)"
          (typing)="onTyping()"
        />
      </div>
    }
  `,
})
export class ConversationDetailComponent {
  private readonly store = inject(Store);

  readonly conversation = this.store.selectSignal(selectSelectedConversation);
  readonly messages = this.store.selectSignal(selectMessages);
  readonly messagesLoading = this.store.selectSignal(selectMessagesLoading);
  readonly typingIndicators = this.store.selectSignal(selectTypingIndicators);

  isLockedForCurrentAgent(): boolean {
    const conv = this.conversation();
    return conv?.assignedAgentId !== null && conv?.status === 'HUMAN';
  }

  onSendMessage(payload: SendMessagePayload): void {
    this.store.dispatch(ConversationActions.sendMessage({ payload }));
  }

  onAssign(): void {
    const conv = this.conversation();
    if (conv) {
      this.store.dispatch(
        ConversationActions.assignToAgent({
          conversationId: conv.id,
          agentId: 'current-user',
        }),
      );
    }
  }

  onTransfer(): void {
    // Opens transfer modal - to be implemented with modal service
  }

  onResolve(): void {
    const conv = this.conversation();
    if (conv) {
      this.store.dispatch(
        ConversationActions.resolveConversation({ conversationId: conv.id }),
      );
    }
  }

  onTyping(): void {
    // Emit typing event via WebSocket
  }
}
