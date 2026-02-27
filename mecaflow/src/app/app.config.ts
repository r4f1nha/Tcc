import { ApplicationConfig, ErrorHandler, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { environment } from '../environments/environment';

import { GlobalErrorHandler } from './core/error/global-error-handler';
import { jwtInterceptor } from './core/auth/interceptors/jwt.interceptor';
import { tenantInterceptor } from './core/auth/interceptors/tenant.interceptor';
import { loadingInterceptor } from './core/auth/interceptors/loading.interceptor';
import { errorInterceptor } from './core/auth/interceptors/error.interceptor';

import { dashboardReducer } from './features/dashboard/store/reducers/dashboard.reducer';
import { conversationReducer } from './features/conversations/store/reducers/conversation.reducer';
import { leadReducer } from './features/leads/store/reducers/lead.reducer';
import { appointmentReducer } from './features/appointments/store/reducers/appointment.reducer';
import { kanbanReducer } from './features/kanban/store/reducers/kanban.reducer';
import { knowledgeBaseReducer } from './features/knowledge-base/store/reducers/knowledge-base.reducer';

import { DashboardEffects } from './features/dashboard/store/effects/dashboard.effects';
import { ConversationEffects } from './features/conversations/store/effects/conversation.effects';
import { LeadEffects } from './features/leads/store/effects/lead.effects';
import { AppointmentEffects } from './features/appointments/store/effects/appointment.effects';
import { KanbanEffects } from './features/kanban/store/effects/kanban.effects';
import { KnowledgeBaseEffects } from './features/knowledge-base/store/effects/knowledge-base.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withInterceptors([
        jwtInterceptor,
        tenantInterceptor,
        loadingInterceptor,
        errorInterceptor,
      ]),
    ),
    provideStore({
      dashboard: dashboardReducer,
      conversations: conversationReducer,
      leads: leadReducer,
      appointments: appointmentReducer,
      kanban: kanbanReducer,
      knowledgeBase: knowledgeBaseReducer,
    }),
    provideEffects([
      DashboardEffects,
      ConversationEffects,
      LeadEffects,
      AppointmentEffects,
      KanbanEffects,
      KnowledgeBaseEffects,
    ]),
    ...(!environment.production
      ? [provideStoreDevtools({ maxAge: 25, logOnly: false })]
      : []),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
};
