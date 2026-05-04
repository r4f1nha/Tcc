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
    <!-- Cabeçalho -->
    <div class="row mb-1">
      <div class="col-12">
        <div class="content-header">
          <i class="fas fa-comments header-icon"></i>&nbsp;Conversas
        </div>
      </div>
    </div>

    <div class="d-flex border rounded" style="height: calc(100vh - 180px); min-height: 400px; overflow: hidden; background: #fff;">
      <!-- Lista de conversas -->
      <div class="border-right bg-white d-flex flex-column" style="width:320px; min-width:280px; flex-shrink:0;">
        <!-- Pesquisa -->
        <div class="p-2 border-bottom">
          <div class="input-group input-group-sm">
            <div class="input-group-prepend">
              <span class="input-group-text"><i class="fas fa-search"></i></span>
            </div>
            <input type="text" class="form-control" placeholder="Buscar conversas..." />
          </div>
        </div>

        <!-- Tabs -->
        <app-tab-filter
          [activeTab]="currentTab()"
          [counts]="tabCounts()"
          (tabChanged)="onTabChanged($event)"
        />

        <!-- Lista -->
        <div class="flex-grow-1 overflow-auto">
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
              <div class="d-flex flex-column align-items-center justify-content-center h-100 p-4 text-muted text-center">
                <i class="fas fa-inbox mb-3" style="font-size:2rem;opacity:0.3;"></i>
                <p class="mb-0" style="font-size:0.85rem;">Nenhuma conversa nesta aba</p>
              </div>
            }
          }
        </div>
      </div>

      <!-- Área do chat -->
      <div class="flex-grow-1 d-flex flex-column" style="min-height:0; overflow:hidden;">
        @if (selectedConversationId()) {
          <app-conversation-detail style="flex:1; min-height:0; display:flex; flex-direction:column;" />
        } @else {
          <div class="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
            <i class="fas fa-comments mb-3" style="font-size:3rem;opacity:0.2;"></i>
            <p style="font-size:0.9rem;">Selecione uma conversa para começar</p>
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
    this.store.dispatch(ConversationActions.loadConversations({ filters: this.filters() }));
    this.store.dispatch(ConversationActions.connectSSE());
  }

  onTabChanged(tab: ConversationTab): void {
    this.store.dispatch(ConversationActions.changeTab({ tab }));
  }

  onSelectConversation(conversationId: string): void {
    this.store.dispatch(ConversationActions.selectConversation({ conversationId }));
    this.store.dispatch(ConversationActions.loadMessages({ conversationId, page: 0 }));
  }
}
