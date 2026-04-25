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
      switchMap(() =>
        this.leadService.list().pipe(
          map((content) =>
            LeadActions.loadLeadsSuccess({
              response: {
                content,
                totalElements: content.length,
                totalPages: 1,
                size: content.length,
                number: 0,
              },
            }),
          ),
          catchError((error) =>
            of(
              LeadActions.loadLeadsFailure({
                error: error?.message ?? 'Erro ao carregar leads',
              }),
            ),
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
            of(
              LeadActions.loadLeadDetailFailure({
                error: error?.message ?? 'Erro ao carregar detalhe do lead',
              }),
            ),
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
            of(
              LeadActions.createLeadFailure({
                error: error?.message ?? 'Erro ao criar lead',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  readonly updateLead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeadActions.updateLead),
      switchMap(({ id, payload }) =>
        this.leadService.update(id, payload).pipe(
          map((lead) => LeadActions.updateLeadSuccess({ lead })),
          catchError((error) =>
            of(
              LeadActions.updateLeadFailure({
                error: error?.message ?? 'Erro ao atualizar lead',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  readonly deleteLead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeadActions.deleteLead),
      switchMap(({ id }) =>
        this.leadService.delete(id).pipe(
          map(() => LeadActions.deleteLeadSuccess({ id })),
          catchError((error) =>
            of(
              LeadActions.deleteLeadFailure({
                error: error?.message ?? 'Erro ao excluir lead',
              }),
            ),
          ),
        ),
      ),
    ),
  );
}