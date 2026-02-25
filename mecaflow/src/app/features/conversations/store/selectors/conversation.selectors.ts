import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  ConversationState,
  conversationAdapter,
} from '../reducers/conversation.reducer';
import { ConversationTab } from '../../models/conversation.model';

export const selectConversationState =
  createFeatureSelector<ConversationState>('conversations');

const { selectAll, selectEntities } = conversationAdapter.getSelectors();

export const selectAllConversations = createSelector(
  selectConversationState,
  selectAll,
);

export const selectConversationEntities = createSelector(
  selectConversationState,
  selectEntities,
);

export const selectConversationFilters = createSelector(
  selectConversationState,
  (state) => state.filters,
);

export const selectCurrentTab = createSelector(
  selectConversationFilters,
  (filters) => filters.tab,
);

export const selectFilteredConversations = createSelector(
  selectAllConversations,
  selectCurrentTab,
  (conversations, tab) => {
    switch (tab) {
      case ConversationTab.BOT:
        return conversations.filter(
          (c) => c.status === 'BOT' || c.status === 'UNASSIGNED',
        );
      case ConversationTab.HUMAN:
        return conversations.filter((c) => c.status === 'HUMAN');
      case ConversationTab.RESOLVED:
        return conversations.filter((c) => c.status === 'RESOLVED');
      default:
        return conversations;
    }
  },
);

export const selectSelectedConversationId = createSelector(
  selectConversationState,
  (state) => state.selectedConversationId,
);

export const selectSelectedConversation = createSelector(
  selectConversationEntities,
  selectSelectedConversationId,
  (entities, id) => (id ? entities[id] ?? null : null),
);

export const selectMessages = createSelector(
  selectConversationState,
  (state) => state.messages,
);

export const selectMessagesLoading = createSelector(
  selectConversationState,
  (state) => state.messagesLoading,
);

export const selectMessagesHasMore = createSelector(
  selectConversationState,
  (state) => state.messagesHasMore,
);

export const selectConversationsLoading = createSelector(
  selectConversationState,
  (state) => state.loading,
);

export const selectTypingIndicators = createSelector(
  selectConversationState,
  selectSelectedConversationId,
  (state, conversationId) =>
    state.typingIndicators.filter(
      (t) => t.conversationId === conversationId,
    ),
);

export const selectTabCounts = createSelector(
  selectAllConversations,
  (conversations) => ({
    bot: conversations.filter(
      (c) => c.status === 'BOT' || c.status === 'UNASSIGNED',
    ).length,
    human: conversations.filter((c) => c.status === 'HUMAN').length,
    resolved: conversations.filter((c) => c.status === 'RESOLVED').length,
  }),
);
