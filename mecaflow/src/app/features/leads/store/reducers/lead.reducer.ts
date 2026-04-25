import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Lead, LeadFilters } from '../../models/lead.model';
import { LeadActions } from '../actions/lead.actions';

export interface LeadState extends EntityState<Lead> {
  selectedLeadId: number | null;
  loading: boolean;
  error: string | null;
  filters: LeadFilters;
  totalItems: number;
  totalPages: number;
  page: number;
  pageSize: number;
}

export const leadAdapter = createEntityAdapter<Lead>({
  selectId: (lead) => lead.id,
  sortComparer: (a, b) =>
    new Date(b.createdAt ?? '').getTime() - new Date(a.createdAt ?? '').getTime(),
});

export const initialState: LeadState = leadAdapter.getInitialState({
  selectedLeadId: null,
  loading: false,
  error: null,
  filters: {
    search: '',
    status: '',
    page: 0,
    pageSize: 10,
  },
  totalItems: 0,
  totalPages: 0,
  page: 0,
  pageSize: 10,
});

export const leadReducer = createReducer(
  initialState,

  on(LeadActions.loadLeads, (state, { filters }) => ({
    ...state,
    loading: true,
    error: null,
    filters: {
      ...state.filters,
      ...filters,
    },
  })),

  on(LeadActions.loadLeadsSuccess, (state, { response }) =>
    leadAdapter.setAll([...response.content], {
      ...state,
      loading: false,
      error: null,
      totalItems: response.totalElements,
      totalPages: response.totalPages,
      page: response.number,
      pageSize: response.size,
    }),
  ),

  on(LeadActions.loadLeadsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(LeadActions.loadLeadDetail, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(LeadActions.loadLeadDetailSuccess, (state, { lead }) =>
    leadAdapter.upsertOne(lead, {
      ...state,
      loading: false,
      error: null,
      selectedLeadId: lead.id,
    }),
  ),

  on(LeadActions.loadLeadDetailFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(LeadActions.createLead, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(LeadActions.createLeadSuccess, (state, { lead }) =>
    leadAdapter.addOne(lead, {
      ...state,
      loading: false,
      error: null,
      totalItems: state.totalItems + 1,
    }),
  ),

  on(LeadActions.createLeadFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(LeadActions.updateLead, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(LeadActions.updateLeadSuccess, (state, { lead }) =>
    leadAdapter.upsertOne(lead, {
      ...state,
      loading: false,
      error: null,
    }),
  ),

  on(LeadActions.updateLeadFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(LeadActions.deleteLead, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(LeadActions.deleteLeadSuccess, (state, { id }) =>
    leadAdapter.removeOne(id, {
      ...state,
      loading: false,
      error: null,
      totalItems: Math.max(0, state.totalItems - 1),
      selectedLeadId: state.selectedLeadId === id ? null : state.selectedLeadId,
    }),
  ),

  on(LeadActions.deleteLeadFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(LeadActions.clearSelectedLead, (state) => ({
    ...state,
    selectedLeadId: null,
  })),
);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = leadAdapter.getSelectors();