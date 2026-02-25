import { createReducer, on } from '@ngrx/store';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { KnowledgeEntry, KnowledgeFilters } from '../../models/knowledge-base.model';
import { KnowledgeBaseActions } from '../actions/knowledge-base.actions';

export interface KnowledgeBaseState extends EntityState<KnowledgeEntry> {
  readonly filters: KnowledgeFilters;
  readonly loading: boolean;
  readonly error: string | null;
}

export const kbAdapter: EntityAdapter<KnowledgeEntry> =
  createEntityAdapter<KnowledgeEntry>({ selectId: (e) => e.id });

const initialState: KnowledgeBaseState = kbAdapter.getInitialState({
  filters: { search: '', category: null },
  loading: false,
  error: null,
});

export const knowledgeBaseReducer = createReducer(
  initialState,
  on(KnowledgeBaseActions.loadEntries, (state) => ({ ...state, loading: true, error: null })),
  on(KnowledgeBaseActions.loadEntriesSuccess, (state, { entries }) =>
    kbAdapter.setAll([...entries], { ...state, loading: false }),
  ),
  on(KnowledgeBaseActions.loadEntriesFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(KnowledgeBaseActions.createEntrySuccess, (state, { entry }) => kbAdapter.addOne(entry, state)),
  on(KnowledgeBaseActions.updateEntrySuccess, (state, { entry }) => kbAdapter.upsertOne(entry, state)),
  on(KnowledgeBaseActions.deleteEntrySuccess, (state, { id }) => kbAdapter.removeOne(id, state)),
  on(KnowledgeBaseActions.setCategoryFilter, (state, { category }) => ({
    ...state,
    filters: { ...state.filters, category },
  })),
);
