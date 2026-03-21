import { Routes } from '@angular/router';
import { authGuard } from '../../core/auth/guards/auth.guard';

export const LABELS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./containers/labels-page/labels-page.component').then(
        (m) => m.LabelsPageComponent,
      ),
  },
];
