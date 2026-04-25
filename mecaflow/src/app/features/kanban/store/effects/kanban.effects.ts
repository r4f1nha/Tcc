import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { ServiceOrderService } from '../../services/service-order.service';
import {
  ServiceOrder,
  ServiceOrderStatus,
} from '../../models/service-order';
import { KanbanActions } from '../actions/kanban.actions';

@Injectable()
export class KanbanEffects {
  private readonly actions$ = inject(Actions);
  private readonly serviceOrderService = inject(ServiceOrderService);

  readonly loadOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KanbanActions.loadServiceOrders),
      switchMap(({ filters }) =>
        this.serviceOrderService.getAll(filters).pipe(
          map((orders: ServiceOrder[]) =>
            KanbanActions.loadServiceOrdersSuccess({ orders }),
          ),
          catchError((error: unknown) =>
            of(
              KanbanActions.loadServiceOrdersFailure({
                error: this.getErrorMessage(error),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  readonly moveCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KanbanActions.moveCard),
      switchMap(({ orderId, newStatus }) =>
        this.serviceOrderService
          .moveToColumn(Number(orderId), newStatus as ServiceOrderStatus)
          .pipe(
            map((order: ServiceOrder) =>
              KanbanActions.moveCardSuccess({ order }),
            ),
            catchError((error: unknown) =>
              of(
                KanbanActions.moveCardFailure({
                  orderId,
                  previousStatus: newStatus,
                  error: this.getErrorMessage(error),
                }),
              ),
            ),
          ),
      ),
    ),
  );

  readonly createOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KanbanActions.createOrder),
      switchMap(({ order }) =>
        this.serviceOrderService.create(order).pipe(
          map((created: ServiceOrder) =>
            KanbanActions.createOrderSuccess({ order: created }),
          ),
          catchError((error: unknown) =>
            of(
              KanbanActions.loadServiceOrdersFailure({
                error: this.getErrorMessage(error),
              }),
            ),
          ),
        ),
      ),
    ),
  );

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    if (typeof error === 'object' && error !== null && 'message' in error) {
      return String((error as { message: unknown }).message);
    }

    return 'Erro desconhecido no módulo Kanban';
  }
}