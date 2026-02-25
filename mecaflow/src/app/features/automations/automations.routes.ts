import { Routes } from '@angular/router';
import { authGuard } from '../../core/auth/guards/auth.guard';

export const AUTOMATIONS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./containers/automations-page/automations-page.component').then(
        (m) => m.AutomationsPageComponent,
      ),
  },
];
