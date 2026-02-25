import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const tenantInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const authService = inject(AuthService);
  const user = authService.getCurrentUser();

  if (!user?.tenantId) {
    return next(req);
  }

  const tenantReq = req.clone({
    setHeaders: { 'X-Tenant-ID': user.tenantId },
  });

  return next(tenantReq);
};
