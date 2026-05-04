import { Routes } from '@angular/router';
import { authGuard } from '../../core/auth/guards/auth.guard';

export const TEAMS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./containers/users-page/users-page.component').then(
        (m) => m.TeamsPageComponent,
      ),
  },
];