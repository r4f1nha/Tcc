import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ConversationActions } from '../../store/actions/conversation.actions';
import {
  selectConversationFilters,
  selectConversationsLoading,
  selectCurrentTab,
  selectFilteredConversations,
  selectSelectedConversationId,
  selectTabCounts,
} from '../../store/selectors/conversation.selectors';
import { ConversationTab } from '../../models/conversation.model';
import { TabFilterComponent } from '../../components/tab-filter/tab-filter.component';
import { ConversationListItemComponent } from '../../components/conversation-list-item/conversation-list-item.component';
import { ConversationDetailComponent } from '../conversation-detail/conversation-detail.component';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-conversation-inbox',
  standalone: true,
  imports: [
    TabFilterComponent,
    ConversationListItemComponent,
    ConversationDetailComponent,
    SkeletonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex h-full">
      <!-- Sidebar - Lista de conversas -->
      <div class="w-80 lg:w-96 border-r border-slate-700/50 flex flex-col bg-[#0f1117]">
        <!-- Search -->
        <div class="p-3 border-b border-slate-700/50">
          <input
            type="text"
            placeholder="Buscar conversas..."
            class="w-full px-3 py-2 bg-[#1a1d27] border border-slate-600/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#4F6EF7]"
          />
        </div>

        <!-- Tabs -->
        <app-tab-filter
          [activeTab]="currentTab()"
          [counts]="tabCounts()"
          (tabChanged)="onTabChanged($event)"
        />

        <!-- List -->
        <div class="flex-1 overflow-y-auto">
          @if (loading()) {
            @for (i of [1,2,3,4,5]; track i) {
              <div class="p-3">
                <app-skeleton variant="text" [count]="2" />
              </div>
            }
          } @else {
            @for (conversation of conversations(); track conversation.id) {
              <app-conversation-list-item
                [conversation]="conversation"
                [isActive]="selectedConversationId() === conversation.id"
                (selected)="onSelectConversation($event)"
              />
            } @empty {
              <div class="flex flex-col items-center justify-center h-full p-6 text-center">
                <p class="text-slate-500 text-sm">Nenhuma conversa nesta aba</p>
              </div>
            }
          }
        </div>
      </div>

      <!-- Chat Area -->
      <div class="flex-1 flex flex-col">
        @if (selectedConversationId()) {
          <app-conversation-detail />
        } @else {
          <div class="flex-1 flex items-center justify-center bg-[#0f1117]">
            <div class="text-center">
              <svg class="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              <p class="text-slate-500 text-sm">Selecione uma conversa para começar</p>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class ConversationInboxComponent implements OnInit {
  private readonly store = inject(Store);

  readonly conversations = this.store.selectSignal(selectFilteredConversations);
  readonly currentTab = this.store.selectSignal(selectCurrentTab);
  readonly tabCounts = this.store.selectSignal(selectTabCounts);
  readonly selectedConversationId = this.store.selectSignal(selectSelectedConversationId);
  readonly loading = this.store.selectSignal(selectConversationsLoading);
  readonly filters = this.store.selectSignal(selectConversationFilters);

  ngOnInit(): void {
    this.store.dispatch(
      ConversationActions.loadConversations({ filters: this.filters() }),
    );
  }

  onTabChanged(tab: ConversationTab): void {
    this.store.dispatch(ConversationActions.changeTab({ tab }));
  }

  onSelectConversation(conversationId: string): void {
    this.store.dispatch(ConversationActions.selectConversation({ conversationId }));
    this.store.dispatch(ConversationActions.loadMessages({ conversationId, page: 0 }));
  }
}
