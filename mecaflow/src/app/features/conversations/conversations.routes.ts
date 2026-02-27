import { Routes } from '@angular/router';

export const CONVERSATIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./containers/conversation-inbox/conversation-inbox.component').then(
        (m) => m.ConversationInboxComponent,
      ),
  },
];
