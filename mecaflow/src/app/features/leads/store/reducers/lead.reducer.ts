import { createReducer, on } from '@ngrx/store';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { Lead, LeadFilters, LeadImportResult } from '../../models/lead.model';
import { LeadActions } from '../actions/lead.actions';

export interface LeadState extends EntityState<Lead> {
  readonly selectedLead: Lead | null;
  readonly filters: LeadFilters;
  readonly totalItems: number;
  readonly totalPages: number;
  readonly loading: boolean;
  readonly error: string | null;
  readonly importResult: LeadImportResult | null;
  readonly importing: boolean;
}

export const leadAdapter: EntityAdapter<Lead> = createEntityAdapter<Lead>({
  selectId: (lead) => lead.id,
  sortComparer: (a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
});

const initialFilters: LeadFilters = {
  search: '',
  status: null,
  labelId: null,
  agentId: null,
  dateFrom: null,
  dateTo: null,
  page: 0,
  pageSize: 20,
};

const initialState: LeadState = leadAdapter.getInitialState({
  selectedLead: null,
  filters: initialFilters,
  totalItems: 0,
  totalPages: 0,
  loading: false,
  error: null,
  importResult: null,
  importing: false,
});

export const leadReducer = createReducer(
  initialState,

  on(LeadActions.loadLeads, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(LeadActions.loadLeadsSuccess, (state, { response }) =>
    leadAdapter.setAll([...response.data], {
      ...state,
      totalItems: response.total,
      totalPages: response.totalPages,
      loading: false,
    }),
  ),
  on(LeadActions.loadLeadsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(LeadActions.loadLeadDetailSuccess, (state, { lead }) => ({
    ...state,
    selectedLead: lead,
  })),

  on(LeadActions.setFilters, (state, { filters }) => ({
    ...state,
    filters,
  })),

  on(LeadActions.createLeadSuccess, (state, { lead }) =>
    leadAdapter.addOne(lead, state),
  ),

  on(LeadActions.updateLeadSuccess, (state, { lead }) =>
    leadAdapter.upsertOne(lead, { ...state, selectedLead: lead }),
  ),

  on(LeadActions.deleteLeadSuccess, (state, { id }) =>
    leadAdapter.removeOne(id, state),
  ),

  on(LeadActions.importLeads, (state) => ({
    ...state,
    importing: true,
    importResult: null,
  })),
  on(LeadActions.importLeadsSuccess, (state, { result }) => ({
    ...state,
    importing: false,
    importResult: result,
  })),
  on(LeadActions.importLeadsFailure, (state, { error }) => ({
    ...state,
    importing: false,
    error,
  })),
);
