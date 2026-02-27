import { Routes } from '@angular/router';
import { authGuard } from '../../core/auth/guards/auth.guard';

export const KANBAN_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./containers/kanban-page/kanban-page.component').then(
        (m) => m.KanbanPageComponent,
      ),
  },
];
