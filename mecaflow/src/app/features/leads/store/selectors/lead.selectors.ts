import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LeadState, leadAdapter } from '../reducers/lead.reducer';

export const selectLeadState = createFeatureSelector<LeadState>('leads');

const { selectAll, selectEntities } = leadAdapter.getSelectors();

export const selectAllLeads = createSelector(selectLeadState, selectAll);

export const selectLeadEntities = createSelector(selectLeadState, selectEntities);

export const selectSelectedLead = createSelector(
  selectLeadState,
  (state) => state.selectedLead,
);

export const selectLeadFilters = createSelector(
  selectLeadState,
  (state) => state.filters,
);

export const selectLeadLoading = createSelector(
  selectLeadState,
  (state) => state.loading,
);

export const selectLeadError = createSelector(
  selectLeadState,
  (state) => state.error,
);

export const selectLeadPagination = createSelector(
  selectLeadState,
  (state) => ({
    page: state.filters.page,
    pageSize: state.filters.pageSize,
    totalItems: state.totalItems,
    totalPages: state.totalPages,
  }),
);

export const selectImportResult = createSelector(
  selectLeadState,
  (state) => state.importResult,
);

export const selectImporting = createSelector(
  selectLeadState,
  (state) => state.importing,
);
