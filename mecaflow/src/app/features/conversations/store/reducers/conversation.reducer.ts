import { createReducer, on } from '@ngrx/store';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import {
  Conversation,
  ConversationFilters,
  ConversationTab,
  Message,
  TypingIndicator,
} from '../../models/conversation.model';
import { ConversationActions } from '../actions/conversation.actions';

export interface ConversationState extends EntityState<Conversation> {
  readonly selectedConversationId: string | null;
  readonly messages: ReadonlyArray<Message>;
  readonly messagesHasMore: boolean;
  readonly messagesPage: number;
  readonly filters: ConversationFilters;
  readonly typingIndicators: ReadonlyArray<TypingIndicator>;
  readonly loading: boolean;
  readonly messagesLoading: boolean;
  readonly error: string | null;
}

export const conversationAdapter: EntityAdapter<Conversation> =
  createEntityAdapter<Conversation>({
    selectId: (conversation) => conversation.id,
    sortComparer: (a, b) =>
      new Date(b.lastMessageAt ?? b.updatedAt).getTime() -
      new Date(a.lastMessageAt ?? a.updatedAt).getTime(),
  });

const initialFilters: ConversationFilters = {
  tab: ConversationTab.UNASSIGNED,
  search: '',
  labelId: null,
  agentId: null,
};

const initialState: ConversationState = conversationAdapter.getInitialState({
  selectedConversationId: null,
  messages: [],
  messagesHasMore: false,
  messagesPage: 0,
  filters: initialFilters,
  typingIndicators: [],
  loading: false,
  messagesLoading: false,
  error: null,
});

export const conversationReducer = createReducer(
  initialState,

  on(ConversationActions.loadConversations, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ConversationActions.loadConversationsSuccess, (state, { conversations }) =>
    conversationAdapter.setAll([...conversations], { ...state, loading: false }),
  ),
  on(ConversationActions.loadConversationsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(ConversationActions.selectConversation, (state, { conversationId }) =>
    conversationAdapter.updateOne(
      { id: conversationId, changes: { unreadCount: 0 } },
      {
        ...state,
        selectedConversationId: conversationId,
        messages: [],
        messagesPage: 0,
        messagesHasMore: false,
      },
    ),
  ),

  on(ConversationActions.loadMessages, (state) => ({
    ...state,
    messagesLoading: true,
  })),
  on(ConversationActions.loadMessagesSuccess, (state, { messages, hasMore }) => ({
    ...state,
    messages: [...state.messages, ...messages],
    messagesHasMore: hasMore,
    messagesPage: state.messagesPage + 1,
    messagesLoading: false,
  })),

  on(ConversationActions.sendMessageSuccess, (state, { message }) => ({
    ...state,
    messages: [...state.messages, message],
  })),

  on(ConversationActions.changeTab, (state, { tab }) => ({
    ...state,
    filters: { ...state.filters, tab },
  })),
  on(ConversationActions.setFilters, (state, { filters }) => ({
    ...state,
    filters,
  })),

  on(
    ConversationActions.assignToAgentSuccess,
    ConversationActions.transferSuccess,
    ConversationActions.resolveSuccess,
    ConversationActions.reopenSuccess,
    ConversationActions.statusChanged,
    ConversationActions.conversationUpdated,
    (state, { conversation }) =>
      conversationAdapter.upsertOne(conversation, state),
  ),

  on(ConversationActions.messageReceived, (state, { message }) => {
    const isCurrentConversation =
      message.conversationId === state.selectedConversationId;
    return {
      ...state,
      messages: isCurrentConversation
        ? [...state.messages, message]
        : state.messages,
    };
  }),

  on(ConversationActions.typingStarted, (state, { indicator }) => ({
    ...state,
    typingIndicators: [...state.typingIndicators, indicator],
  })),
  on(ConversationActions.typingStopped, (state, { indicator }) => ({
    ...state,
    typingIndicators: state.typingIndicators.filter(
      (t) =>
        t.conversationId !== indicator.conversationId ||
        t.userId !== indicator.userId,
    ),
  })),
);
