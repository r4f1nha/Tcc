import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../../environments/environment';

let isRefreshing = false;

export const jwtInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const authService = inject(AuthService);

  if (isAuthEndpoint(req.url)) {
    return next(req);
  }

  const authenticatedReq = addAuthorizationHeader(req, authService);

  return next(authenticatedReq).pipe(
    catchError((error) => {
      if (error.status === 401 && !isRefreshing) {
        return handleUnauthorized(req, next, authService);
      }
      return throwError(() => error);
    }),
  );
};

function addAuthorizationHeader(
  req: HttpRequest<unknown>,
  authService: AuthService,
): HttpRequest<unknown> {
  const token = authService.getAccessToken();
  if (!token) {
    return req;
  }

  return req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });
}

function handleUnauthorized(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
) {
  isRefreshing = true;

  return authService.refreshToken().pipe(
    switchMap(() => {
      isRefreshing = false;
      const retryReq = addAuthorizationHeader(req, authService);
      return next(retryReq);
    }),
    catchError((refreshError) => {
      isRefreshing = false;
      authService.logout();
      return throwError(() => refreshError);
    }),
  );
}

function isAuthEndpoint(url: string): boolean {
  const authBaseUrl = `${environment.apiUrl}/auth`;
  return url.startsWith(authBaseUrl);
}
