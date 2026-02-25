import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { KanbanService } from '../../services/kanban.service';
import { KanbanActions } from '../actions/kanban.actions';

@Injectable()
export class KanbanEffects {
  private readonly actions$ = inject(Actions);
  private readonly kanbanService = inject(KanbanService);

  readonly loadOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KanbanActions.loadServiceOrders),
      switchMap(({ filters }) =>
        this.kanbanService.getAll(filters).pipe(
          map((orders) => KanbanActions.loadServiceOrdersSuccess({ orders })),
          catchError((error) =>
            of(KanbanActions.loadServiceOrdersFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  readonly moveCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KanbanActions.moveCard),
      switchMap(({ orderId, newStatus }) =>
        this.kanbanService.moveToColumn(orderId, newStatus).pipe(
          map((order) => KanbanActions.moveCardSuccess({ order })),
          catchError((error) =>
            of(KanbanActions.moveCardFailure({
              orderId,
              previousStatus: newStatus,
              error: error.message,
            })),
          ),
        ),
      ),
    ),
  );

  readonly createOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KanbanActions.createOrder),
      switchMap(({ order }) =>
        this.kanbanService.create(order).pipe(
          map((created) => KanbanActions.createOrderSuccess({ order: created })),
        ),
      ),
    ),
  );
}
