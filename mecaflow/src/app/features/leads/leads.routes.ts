import { Routes } from '@angular/router';
import { authGuard } from '../../core/auth/guards/auth.guard';

export const LEADS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./containers/lead-list-page/lead-list-page.component').then(
        (m) => m.LeadListPageComponent,
      ),
  },
  {
    path: ':id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./containers/lead-detail-page/lead-detail-page.component').then(
        (m) => m.LeadDetailPageComponent,
      ),
  },
];
