import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';

export const routes: Routes = [
  // Auth (public)
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },

  // App shell (authenticated)
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/shell/shell.component').then((m) => m.ShellComponent),
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
      },
      {
        path: 'conversations',
        loadChildren: () =>
          import('./features/conversations/conversations.routes').then((m) => m.CONVERSATIONS_ROUTES),
      },
      {
        path: 'leads',
        loadChildren: () =>
          import('./features/leads/leads.routes').then((m) => m.LEADS_ROUTES),
      },
      {
        path: 'appointments',
        loadChildren: () =>
          import('./features/appointments/appointments.routes').then((m) => m.APPOINTMENTS_ROUTES),
      },
      {
        path: 'kanban',
        loadChildren: () =>
          import('./features/kanban/kanban.routes').then((m) => m.KANBAN_ROUTES),
      },
      {
        path: 'knowledge-base',
        loadChildren: () =>
          import('./features/knowledge-base/knowledge-base.routes').then((m) => m.KNOWLEDGE_BASE_ROUTES),
      },
      {
        path: 'automations',
        loadChildren: () =>
          import('./features/automations/automations.routes').then((m) => m.AUTOMATIONS_ROUTES),
      },
      {
        path: 'labels',
        loadChildren: () =>
          import('./features/labels/labels.routes').then((m) => m.LABELS_ROUTES),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./features/users/users.routes').then((m) => m.TEAMS_ROUTES),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./features/settings/settings.routes').then((m) => m.SETTINGS_ROUTES),
      },
      {
  path: 'permissions',
  loadChildren: () =>
    import('./features/roles/roles.routes').then((m) => m.ROLES_ROUTES),
},
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },

  // Fallback
  { path: '**', redirectTo: 'auth/login' },
];
