import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { LeadService } from '../../services/lead.service';
import { LeadActions } from '../actions/lead.actions';

@Injectable()
export class LeadEffects {
  private readonly actions$ = inject(Actions);
  private readonly leadService = inject(LeadService);

  readonly loadLeads$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeadActions.loadLeads),
      switchMap(({ filters }) =>
        this.leadService.getAll(filters).pipe(
          map((response) => LeadActions.loadLeadsSuccess({ response })),
          catchError((error) =>
            of(LeadActions.loadLeadsFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  readonly loadLeadDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeadActions.loadLeadDetail),
      switchMap(({ id }) =>
        this.leadService.getById(id).pipe(
          map((lead) => LeadActions.loadLeadDetailSuccess({ lead })),
          catchError((error) =>
            of(LeadActions.loadLeadDetailFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  readonly createLead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeadActions.createLead),
      switchMap(({ payload }) =>
        this.leadService.create(payload).pipe(
          map((lead) => LeadActions.createLeadSuccess({ lead })),
          catchError((error) =>
            of(LeadActions.createLeadFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  readonly importLeads$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeadActions.importLeads),
      switchMap(({ file }) =>
        this.leadService.importFromCsv(file).pipe(
          map((result) => LeadActions.importLeadsSuccess({ result })),
          catchError((error) =>
            of(LeadActions.importLeadsFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );
}
