import { HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { LogService } from '../../services/log.service';

export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const logService = inject(LogService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const details: Record<string, unknown> = {
        url: req.url,
        method: req.method,
        status: error.status,
        statusText: error.statusText,
        message: error.message,
      };

      if (error.status === 0) {
        logService.error('Network error or server unreachable', 'ErrorInterceptor', details);
      } else if (error.status === 401) {
        logService.warn('Unauthorized request', 'ErrorInterceptor', details);
        router.navigate(['/login']);
      } else if (error.status === 403) {
        logService.warn('Forbidden request', 'ErrorInterceptor', details);
        router.navigate(['/unauthorized']);
      } else if (error.status >= 500) {
        logService.error('Server error', 'ErrorInterceptor', details);
      } else {
        logService.warn('HTTP error', 'ErrorInterceptor', details);
      }

      return throwError(() => error);
    }),
  );
};
