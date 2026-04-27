import { Routes } from '@angular/router';
import { LeadListPageComponent } from './containers/lead-list-page/lead-list-page.component';
import { LeadDetailPageComponent } from './containers/lead-detail-page/lead-detail-page.component';
import { LeadCreatePageComponent } from './containers/lead-create-page/lead-create-page.component';

export const LEADS_ROUTES: Routes = [
  {
    path: '',
    component: LeadListPageComponent,
  },
  {
    path: 'create',
    component: LeadCreatePageComponent,
  },
  {
    path: 'edit/:id',
    component: LeadCreatePageComponent,
  },
  {
    path: ':id',
    component: LeadDetailPageComponent,
  },
];