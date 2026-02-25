import { createFeatureSelector, createSelector } from '@ngrx/store';
import { KnowledgeBaseState, kbAdapter } from '../reducers/knowledge-base.reducer';

export const selectKBState = createFeatureSelector<KnowledgeBaseState>('knowledgeBase');
const { selectAll } = kbAdapter.getSelectors();

export const selectAllEntries = createSelector(selectKBState, selectAll);
export const selectKBLoading = createSelector(selectKBState, (s) => s.loading);
export const selectKBFilters = createSelector(selectKBState, (s) => s.filters);
export const selectKBError = createSelector(selectKBState, (s) => s.error);
