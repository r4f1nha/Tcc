import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardActions } from '../actions/dashboard.actions';

@Injectable()
export class DashboardEffects {
  private readonly actions$ = inject(Actions);
  private readonly dashboardService = inject(DashboardService);

  readonly loadMetrics$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadMetrics, DashboardActions.changePeriod),
      switchMap(({ period }) =>
        this.dashboardService.getMetrics(period).pipe(
          map((metrics) => DashboardActions.loadMetricsSuccess({ metrics })),
          catchError((error) =>
            of(DashboardActions.loadMetricsFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );
}
