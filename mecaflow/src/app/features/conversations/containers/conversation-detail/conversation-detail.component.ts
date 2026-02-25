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
      <div class="flex flex-col h-full bg-[#0f1117]">
        <!-- Header -->
        <app-conversation-header
          [conversation]="conv"
          (assignClicked)="onAssign()"
          (transferClicked)="onTransfer()"
          (resolveClicked)="onResolve()"
        />

        <!-- Messages -->
        <div class="flex-1 overflow-y-auto p-4">
          @if (messagesLoading()) {
            <div class="flex justify-center py-4">
              <div class="animate-spin w-6 h-6 border-2 border-[#4F6EF7] border-t-transparent rounded-full"></div>
            </div>
          }
          @for (message of messages(); track message.id) {
            <app-message-bubble [message]="message" />
          }
          @if (typingIndicators().length > 0) {
            <div class="flex items-center gap-2 text-xs text-slate-400 px-4 py-2">
              <div class="flex gap-1">
                <div class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                <div class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                <div class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
              </div>
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
