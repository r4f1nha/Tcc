import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { KnowledgeBaseService } from '../../services/knowledge-base.service';
import { KnowledgeBaseActions } from '../actions/knowledge-base.actions';

@Injectable()
export class KnowledgeBaseEffects {
  private readonly actions$ = inject(Actions);
  private readonly kbService = inject(KnowledgeBaseService);

  readonly loadEntries$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KnowledgeBaseActions.loadEntries),
      switchMap(({ filters }) =>
        this.kbService.getAll(filters).pipe(
          map((entries) => KnowledgeBaseActions.loadEntriesSuccess({ entries })),
          catchError((error) => of(KnowledgeBaseActions.loadEntriesFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  readonly createEntry$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KnowledgeBaseActions.createEntry),
      switchMap(({ entry }) =>
        this.kbService.create(entry).pipe(
          map((created) => KnowledgeBaseActions.createEntrySuccess({ entry: created })),
          catchError((error) => of(KnowledgeBaseActions.createEntryFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  readonly deleteEntry$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KnowledgeBaseActions.deleteEntry),
      switchMap(({ id }) =>
        this.kbService.delete(id).pipe(
          map(() => KnowledgeBaseActions.deleteEntrySuccess({ id })),
        ),
      ),
    ),
  );
}
