import { createActionGroup, props } from '@ngrx/store';
import { KnowledgeCategory, KnowledgeEntry, KnowledgeFilters } from '../../models/knowledge-base.model';

export const KnowledgeBaseActions = createActionGroup({
  source: 'Knowledge Base',
  events: {
    'Load Entries': props<{ filters: KnowledgeFilters }>(),
    'Load Entries Success': props<{ entries: ReadonlyArray<KnowledgeEntry> }>(),
    'Load Entries Failure': props<{ error: string }>(),

    'Create Entry': props<{ entry: Partial<KnowledgeEntry> }>(),
    'Create Entry Success': props<{ entry: KnowledgeEntry }>(),
    'Create Entry Failure': props<{ error: string }>(),

    'Update Entry': props<{ id: string; entry: Partial<KnowledgeEntry> }>(),
    'Update Entry Success': props<{ entry: KnowledgeEntry }>(),

    'Delete Entry': props<{ id: string }>(),
    'Delete Entry Success': props<{ id: string }>(),

    'Set Category Filter': props<{ category: KnowledgeCategory | null }>(),
  },
});
