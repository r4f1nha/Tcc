import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const permissionGuard = (permissions: string[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = authService.getCurrentUser();

    if (!user) {
      return router.createUrlTree(['/auth/login']);
    }

    if (user.role === 'OWNER') {
      return true;
    }

    const userPermissions = user.permissions ?? [];

    const hasPermission = permissions.some((permission) =>
      userPermissions.includes(permission)
    );

    return hasPermission ? true : router.createUrlTree(['/dashboard']);
  };
};