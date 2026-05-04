import { inject, Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Conversation, Message } from '../models/conversation.model';

export interface SseEvent {
  type: 'message' | 'conversation';
  data: Message | Conversation;
}

@Injectable({ providedIn: 'root' })
export class SseService implements OnDestroy {
  private eventSource: EventSource | null = null;

  connect(): Observable<SseEvent> {
    return new Observable<SseEvent>((subscriber) => {
      this.eventSource = new EventSource(`${environment.apiUrl}/sse/events`);

      this.eventSource.addEventListener('message', (event: MessageEvent) => {
        subscriber.next({ type: 'message', data: JSON.parse(event.data) as Message });
      });

      this.eventSource.addEventListener('conversation', (event: MessageEvent) => {
        subscriber.next({ type: 'conversation', data: JSON.parse(event.data) as Conversation });
      });

      this.eventSource.onerror = () => {
        subscriber.error('SSE connection lost');
      };

      return () => {
        this.eventSource?.close();
        this.eventSource = null;
      };
    });
  }

  ngOnDestroy(): void {
    this.eventSource?.close();
  }
}
