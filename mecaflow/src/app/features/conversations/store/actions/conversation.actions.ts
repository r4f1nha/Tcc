import { createActionGroup, emptyProps, props } from '@ngrx/store';

import {
  Conversation,
  ConversationFilters,
  ConversationTab,
  Message,
  SendMessagePayload,
  TypingIndicator,
} from '../../models/conversation.model';

export const ConversationActions = createActionGroup({
  source: 'Conversations',
  events: {
    'Load Conversations': props<{ filters: ConversationFilters }>(),
    'Load Conversations Success': props<{ conversations: ReadonlyArray<Conversation> }>(),
    'Load Conversations Failure': props<{ error: string }>(),

    'Select Conversation': props<{ conversationId: string }>(),
    'Load Messages': props<{ conversationId: string; page: number }>(),
    'Load Messages Success': props<{ messages: ReadonlyArray<Message>; hasMore: boolean }>(),
    'Load Messages Failure': props<{ error: string }>(),

    'Send Message': props<{ payload: SendMessagePayload }>(),
    'Send Message Success': props<{ message: Message }>(),
    'Send Message Failure': props<{ error: string }>(),

    'Change Tab': props<{ tab: ConversationTab }>(),
    'Set Filters': props<{ filters: ConversationFilters }>(),

    'Assign To Agent': props<{ conversationId: string; agentId: string }>(),
    'Assign To Agent Success': props<{ conversation: Conversation }>(),

    'Transfer Conversation': props<{ conversationId: string; targetId: string }>(),
    'Transfer Success': props<{ conversation: Conversation }>(),

    'Resolve Conversation': props<{ conversationId: string }>(),
    'Resolve Success': props<{ conversation: Conversation }>(),

    'Add Label': props<{ conversationId: string; labelId: string }>(),
    'Remove Label': props<{ conversationId: string; labelId: string }>(),

    // SSE real-time
    'Connect SSE': emptyProps(),

    // Real-time events
    'Message Received': props<{ message: Message }>(),
    'Typing Started': props<{ indicator: TypingIndicator }>(),
    'Typing Stopped': props<{ indicator: TypingIndicator }>(),
    'Status Changed': props<{ conversation: Conversation }>(),
    'Conversation Updated': props<{ conversation: Conversation }>(),
  },
});
