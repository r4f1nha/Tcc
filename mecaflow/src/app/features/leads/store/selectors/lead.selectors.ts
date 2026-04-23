import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LeadState, selectAll, selectEntities } from '../reducers/lead.reducer';

export const selectLeadState = createFeatureSelector<LeadState>('leads');

export const selectAllLeads = createSelector(
  selectLeadState,
  (state) => selectAll(state),
);

export const selectLeadEntities = createSelector(
  selectLeadState,
  (state) => selectEntities(state),
);

export const selectSelectedLeadId = createSelector(
  selectLeadState,
  (state) => state.selectedLeadId,
);

export const selectSelectedLead = createSelector(
  selectLeadEntities,
  selectSelectedLeadId,
  (entities, selectedLeadId) =>
    selectedLeadId != null ? entities[selectedLeadId] ?? null : null,
);

export const selectLeadLoading = createSelector(
  selectLeadState,
  (state) => state.loading,
);

export const selectLeadError = createSelector(
  selectLeadState,
  (state) => state.error,
);

export const selectLeadFilters = createSelector(
  selectLeadState,
  (state) => state.filters,
);

export const selectLeadPagination = createSelector(
  selectLeadState,
  (state) => ({
    page: state.page,
    pageSize: state.pageSize,
    totalItems: state.totalItems,
    totalPages: state.totalPages,
  }),
);

export const selectLeadImportResult = createSelector(
  selectLeadState,
  (state) => state.importResult,
);