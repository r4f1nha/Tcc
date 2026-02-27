import { inject, Injectable, OnDestroy } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/services/auth.service';
import { LogService } from '../services/log.service';

export interface WebSocketEvent<T = unknown> {
  event: string;
  payload: T;
}

@Injectable({ providedIn: 'root' })
export class WebSocketService implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly logService = inject(LogService);

  private socket: Socket | null = null;
  private readonly connectionStatus = new Subject<boolean>();

  readonly connected$ = this.connectionStatus.asObservable();

  connect(): void {
    if (this.socket?.connected) {
      return;
    }

    const token = this.authService.getAccessToken();
    if (!token) {
      this.logService.warn('Cannot connect to WebSocket without authentication', 'WebSocketService');
      return;
    }

    this.socket = io(environment.wsUrl, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });

    this.registerLifecycleHandlers();
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connectionStatus.next(false);
      this.logService.debug('WebSocket disconnected', 'WebSocketService');
    }
  }

  on<T>(event: string): Observable<T> {
    return new Observable<T>((subscriber) => {
      if (!this.socket) {
        subscriber.error(new Error('WebSocket is not connected'));
        return;
      }

      const handler = (data: T): void => {
        subscriber.next(data);
      };

      this.socket.on(event, handler);

      return () => {
        this.socket?.off(event, handler);
      };
    });
  }

  emit<T>(event: string, payload: T): void {
    if (!this.socket?.connected) {
      this.logService.warn(
        `Cannot emit event "${event}": WebSocket is not connected`,
        'WebSocketService',
      );
      return;
    }

    this.socket.emit(event, payload);
  }

  ngOnDestroy(): void {
    this.disconnect();
    this.connectionStatus.complete();
  }

  private registerLifecycleHandlers(): void {
    if (!this.socket) {
      return;
    }

    this.socket.on('connect', () => {
      this.connectionStatus.next(true);
      this.logService.info('WebSocket connected', 'WebSocketService');
    });

    this.socket.on('disconnect', (reason: string) => {
      this.connectionStatus.next(false);
      this.logService.info('WebSocket disconnected', 'WebSocketService', { reason });
    });

    this.socket.on('connect_error', (error: Error) => {
      this.logService.error('WebSocket connection error', 'WebSocketService', {
        message: error.message,
      });
    });
  }
}
