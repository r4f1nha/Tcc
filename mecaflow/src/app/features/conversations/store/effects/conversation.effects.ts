import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EMPTY, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { ConversationService } from '../../services/conversation.service';
import { SseService } from '../../services/sse.service';
import { ConversationActions } from '../actions/conversation.actions';
import { selectConversationFilters } from '../selectors/conversation.selectors';
import { Conversation, Message } from '../../models/conversation.model';

@Injectable()
export class ConversationEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly conversationService = inject(ConversationService);
  private readonly sseService = inject(SseService);

  readonly loadConversations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConversationActions.loadConversations, ConversationActions.changeTab),
      withLatestFrom(this.store.select(selectConversationFilters)),
      switchMap(([_, filters]) =>
        this.conversationService.getAll(filters).pipe(
          map((conversations) =>
            ConversationActions.loadConversationsSuccess({ conversations }),
          ),
          catchError((error) =>
            of(ConversationActions.loadConversationsFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  readonly loadMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConversationActions.loadMessages),
      switchMap(({ conversationId, page }) =>
        this.conversationService.getMessages(conversationId, page).pipe(
          map((response) =>
            ConversationActions.loadMessagesSuccess({
              messages: response.data,
              hasMore: response.hasMore,
            }),
          ),
          catchError((error) =>
            of(ConversationActions.loadMessagesFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  readonly sendMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConversationActions.sendMessage),
      switchMap(({ payload }) =>
        this.conversationService.sendMessage(payload).pipe(
          map((message) => ConversationActions.sendMessageSuccess({ message })),
          catchError((error) =>
            of(ConversationActions.sendMessageFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  readonly assignToAgent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConversationActions.assignToAgent),
      switchMap(({ conversationId, agentId, agentName }) =>
        this.conversationService.assignToAgent(conversationId, agentId, agentName).pipe(
          map((conversation) =>
            ConversationActions.assignToAgentSuccess({ conversation }),
          ),
          catchError((error) =>
            of(ConversationActions.loadConversationsFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  readonly reopen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConversationActions.reopenConversation),
      switchMap(({ conversationId }) =>
        this.conversationService.reopenConversation(conversationId).pipe(
          map((conversation) => ConversationActions.reopenSuccess({ conversation })),
          catchError((error) =>
            of(ConversationActions.loadConversationsFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  readonly resolveConversation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConversationActions.resolveConversation),
      switchMap(({ conversationId }) =>
        this.conversationService.resolveConversation(conversationId).pipe(
          map((conversation) =>
            ConversationActions.resolveSuccess({ conversation }),
          ),
        ),
      ),
    ),
  );

  readonly transferConversation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConversationActions.transferConversation),
      switchMap(({ conversationId, targetId }) =>
        this.conversationService.transferConversation(conversationId, targetId).pipe(
          map((conversation) =>
            ConversationActions.transferSuccess({ conversation }),
          ),
        ),
      ),
    ),
  );

  readonly connectSse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConversationActions.connectSSE),
      switchMap(() =>
        this.sseService.connect().pipe(
          map((event) => {
            if (event.type === 'message') {
              return ConversationActions.messageReceived({ message: event.data as Message });
            }
            return ConversationActions.conversationUpdated({ conversation: event.data as Conversation });
          }),
          catchError(() => EMPTY),
        ),
      ),
    ),
  );
}
