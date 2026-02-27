import { Routes } from '@angular/router';
import { authGuard } from '../../core/auth/guards/auth.guard';
import { roleGuard } from '../../core/auth/guards/role.guard';
import { UserRole } from '../../core/auth/models/user.model';

export const TEAMS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard, roleGuard([UserRole.OWNER])],
    loadComponent: () =>
      import('./containers/teams-page/teams-page.component').then(
        (m) => m.TeamsPageComponent,
      ),
  },
];
