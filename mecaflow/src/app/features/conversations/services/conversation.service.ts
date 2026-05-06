import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  Conversation,
  ConversationFilters,
  Message,
  SendMessagePayload,
} from '../models/conversation.model';

interface PaginatedMessages {
  readonly data: ReadonlyArray<Message>;
  readonly hasMore: boolean;
  readonly total: number;
}

@Injectable({ providedIn: 'root' })
export class ConversationService {
  private readonly http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/conversations`;

  getAll(filters: ConversationFilters): Observable<ReadonlyArray<Conversation>> {
    let params = new HttpParams().set('tab', filters.tab);
    if (filters.search) params = params.set('search', filters.search);
    if (filters.labelId) params = params.set('labelId', filters.labelId);
    if (filters.agentId) params = params.set('agentId', filters.agentId);
    return this.http.get<ReadonlyArray<Conversation>>(this.API, { params });
  }

  getById(id: string): Observable<Conversation> {
    return this.http.get<Conversation>(`${this.API}/${id}`);
  }

  getMessages(conversationId: string, page: number): Observable<PaginatedMessages> {
    const params = new HttpParams().set('page', page.toString());
    return this.http.get<PaginatedMessages>(
      `${this.API}/${conversationId}/messages`,
      { params },
    );
  }

  sendMessage(payload: SendMessagePayload): Observable<Message> {
    return this.http.post<Message>(
      `${this.API}/${payload.conversationId}/messages`,
      payload,
    );
  }

  assignToAgent(conversationId: string, agentId: string, agentName: string): Observable<Conversation> {
    return this.http.patch<Conversation>(
      `${this.API}/${conversationId}/assign`,
      { agentId, agentName },
    );
  }

  reopenConversation(conversationId: string): Observable<Conversation> {
    return this.http.patch<Conversation>(
      `${this.API}/${conversationId}/reopen`,
      {},
    );
  }

  transferConversation(conversationId: string, targetId: string): Observable<Conversation> {
    return this.http.patch<Conversation>(
      `${this.API}/${conversationId}/transfer`,
      { targetId },
    );
  }

  resolveConversation(conversationId: string): Observable<Conversation> {
    return this.http.patch<Conversation>(
      `${this.API}/${conversationId}/resolve`,
      {},
    );
  }

  addLabel(conversationId: string, labelId: string): Observable<Conversation> {
    return this.http.post<Conversation>(
      `${this.API}/${conversationId}/labels`,
      { labelId },
    );
  }

  removeLabel(conversationId: string, labelId: string): Observable<Conversation> {
    return this.http.delete<Conversation>(
      `${this.API}/${conversationId}/labels/${labelId}`,
    );
  }

  setHumanMode(conversationId: string): Observable<Conversation> {
    return this.http.patch<Conversation>(`${this.API}/${conversationId}/human`, {});
  }

  setBotMode(conversationId: string): Observable<Conversation> {
    return this.http.patch<Conversation>(`${this.API}/${conversationId}/bot`, {});
  }
}
