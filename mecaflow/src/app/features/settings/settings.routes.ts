import { Routes } from '@angular/router';
import { authGuard } from '../../core/auth/guards/auth.guard';
import { roleGuard } from '../../core/auth/guards/role.guard';
import { UserRole } from '../../core/auth/models/user.model';

export const SETTINGS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard, roleGuard([UserRole.OWNER, UserRole.ADMIN])],
    loadComponent: () =>
      import('./containers/settings-page/settings-page.component').then(
        (m) => m.SettingsPageComponent,
      ),
  },
];
