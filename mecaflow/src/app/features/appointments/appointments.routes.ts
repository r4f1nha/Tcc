import { Routes } from '@angular/router';
import { authGuard } from '../../core/auth/guards/auth.guard';

export const APPOINTMENTS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./containers/agenda-page/agenda-page.component').then(
        (m) => m.AgendaPageComponent,
      ),
  },
];
