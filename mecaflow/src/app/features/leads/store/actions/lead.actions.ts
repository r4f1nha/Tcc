import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CreateLeadPayload, Lead, LeadFilters, LeadImportResult, PaginatedResponse } from '../../models/lead.model';

export const LeadActions = createActionGroup({
  source: 'Leads',
  events: {
    'Load Leads': props<{ filters: LeadFilters }>(),
    'Load Leads Success': props<{ response: PaginatedResponse<Lead> }>(),
    'Load Leads Failure': props<{ error: string }>(),

    'Load Lead Detail': props<{ id: string }>(),
    'Load Lead Detail Success': props<{ lead: Lead }>(),
    'Load Lead Detail Failure': props<{ error: string }>(),

    'Create Lead': props<{ payload: CreateLeadPayload }>(),
    'Create Lead Success': props<{ lead: Lead }>(),
    'Create Lead Failure': props<{ error: string }>(),

    'Update Lead': props<{ id: number; payload: CreateLeadPayload }>(),
    'Update Lead Success': props<{ lead: Lead }>(),
    'Update Lead Failure': props<{ error: string }>(),

    'Delete Lead': props<{ id: number }>(),
    'Delete Lead Success': props<{ id: number }>(),
    'Delete Lead Failure': props<{ error: string }>(),

    'Import Leads': props<{ file: File }>(),
    'Import Leads Success': props<{ result: LeadImportResult }>(),
    'Import Leads Failure': props<{ error: string }>(),

    'Clear Selected Lead': emptyProps(),
  },
});