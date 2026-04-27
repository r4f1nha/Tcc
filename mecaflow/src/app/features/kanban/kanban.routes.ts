import { Routes } from '@angular/router';

import { KanbanPageComponent } from './containers/kanban-page/kanban-page.component';
import { ServiceOrderCreatePageComponent } from './containers/service-order-create-page/service-order-create-page.component';
import { ServiceOrderDetailPageComponent } from './containers/service-order-detail-page/service-order-detail-page.component';

export const KANBAN_ROUTES: Routes = [
  {
    path: '',
    component: KanbanPageComponent,
  },
  {
    path: 'create',
    component: ServiceOrderCreatePageComponent,
  },
  {
    path: ':id',
    component: ServiceOrderDetailPageComponent,
  },
];