import { computed, inject, Injectable, OnDestroy, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, EMPTY, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  TokenPayload,
  User,
  UserRole,
} from '../models/user.model';
import { LogService } from '../../services/log.service';

const TOKEN_STORAGE_KEY = 'mecaflow-access-token';
const IDLE_EVENTS: ReadonlyArray<keyof DocumentEventMap> = [
  'mousemove',
  'keydown',
  'mousedown',
  'touchstart',
  'scroll',
];

@Injectable({ providedIn: 'root' })
export class AuthService implements OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly logService = inject(LogService);

  private readonly authEndpoint = `${environment.apiUrl}/auth`;
  private readonly currentUser = signal<User | null>(null);
  private idleTimerId: ReturnType<typeof setTimeout> | null = null;
  private readonly idleListenerBound = this.resetIdleTimer.bind(this);

  readonly user = this.currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly currentRole = computed(() => this.currentUser()?.role ?? null);

  constructor() {
    this.restoreSession();
  }

  ngOnDestroy(): void {
    this.stopIdleDetection();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.authEndpoint}/login`, credentials, { withCredentials: true })
      .pipe(
        tap((response) => {
          this.storeAccessToken(response.accessToken);
          this.currentUser.set(response.user);
          this.startIdleDetection();
          this.logService.info('User logged in', 'AuthService', { userId: response.user.id });
        }),
      );
  }

  logout(): void {
    this.http
      .post(`${this.authEndpoint}/logout`, {}, { withCredentials: true })
      .pipe(catchError(() => EMPTY))
      .subscribe();

    this.clearSession();
    this.logService.info('User logged out', 'AuthService');
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<RefreshTokenResponse> {
    return this.http
      .post<RefreshTokenResponse>(`${this.authEndpoint}/refresh`, {}, { withCredentials: true })
      .pipe(
        tap((response) => {
          this.storeAccessToken(response.accessToken);
          this.logService.debug('Token refreshed', 'AuthService');
        }),
        catchError((error) => {
          this.logService.warn('Token refresh failed, clearing session', 'AuthService');
          this.clearSession();
          this.router.navigate(['/login']);
          throw error;
        }),
      );
  }

  getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  getCurrentUserRole(): UserRole | null {
    return this.currentRole();
  }

  hasRole(role: UserRole): boolean {
    return this.currentRole() === role;
  }

  hasAnyRole(roles: ReadonlyArray<UserRole>): boolean {
    const currentRole = this.currentRole();
    return currentRole !== null && roles.includes(currentRole);
  }

  devLogin(role: UserRole = UserRole.OWNER): void {
    const fakeUser: User = {
      id: 'dev-user-001',
      name: 'Renzo Dev',
      email: 'dev@mecaflow.com',
      role,
      tenantId: 'tenant-dev-001',
      avatarUrl: null,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.currentUser.set(fakeUser);
    this.logService.info('Dev login ativado', 'AuthService', { role });
  }

  private restoreSession(): void {
    const token = this.getAccessToken();
    if (!token) {
      return;
    }

    const payload = this.decodeToken(token);
    if (!payload || this.isTokenExpired(payload)) {
      this.clearSession();
      return;
    }

    this.currentUser.set(this.mapPayloadToUser(payload));
    this.startIdleDetection();
  }

  private decodeToken(token: string): TokenPayload | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(
        atob(base64)
          .split('')
          .map((char) => '%' + ('00' + char.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );
      return JSON.parse(json) as TokenPayload;
    } catch {
      this.logService.warn('Failed to decode access token', 'AuthService');
      return null;
    }
  }

  private isTokenExpired(payload: TokenPayload): boolean {
    const nowInSeconds = Math.floor(Date.now() / 1000);
    return payload.exp < nowInSeconds;
  }

  private mapPayloadToUser(payload: TokenPayload): User {
    return {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      tenantId: payload.tenantId,
      avatarUrl: null,
      active: true,
      createdAt: '',
      updatedAt: '',
    };
  }

  private storeAccessToken(token: string): void {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }

  private clearSession(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    this.currentUser.set(null);
    this.stopIdleDetection();
  }

  private startIdleDetection(): void {
    this.stopIdleDetection();
    IDLE_EVENTS.forEach((event) =>
      document.addEventListener(event, this.idleListenerBound, { passive: true }),
    );
    this.scheduleIdleLogout();
  }

  private stopIdleDetection(): void {
    if (this.idleTimerId !== null) {
      clearTimeout(this.idleTimerId);
      this.idleTimerId = null;
    }
    IDLE_EVENTS.forEach((event) =>
      document.removeEventListener(event, this.idleListenerBound),
    );
  }

  private resetIdleTimer(): void {
    if (this.idleTimerId !== null) {
      clearTimeout(this.idleTimerId);
    }
    this.scheduleIdleLogout();
  }

  private scheduleIdleLogout(): void {
    this.idleTimerId = setTimeout(() => {
      this.logService.info('Session expired due to inactivity', 'AuthService');
      this.logout();
    }, environment.idleTimeout);
  }
}
