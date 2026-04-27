import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { AppointmentService } from '../../services/appointment.service';
import { AppointmentActions } from '../actions/appointment.actions';

@Injectable()
export class AppointmentEffects {
  private readonly actions$ = inject(Actions);
  private readonly appointmentService = inject(AppointmentService);

  private getErrorMessage(error: any): string {
  return error?.error?.message || error?.error || error?.message || 'Erro inesperado';
}

  readonly loadAppointments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentActions.loadAppointments),
      switchMap(({ filters }) =>
        this.appointmentService.getAll(filters).pipe(
          map((appointments) =>
            AppointmentActions.loadAppointmentsSuccess({ appointments })
          ),
          catchError((error) =>
            of(
              AppointmentActions.loadAppointmentsFailure({
                error: error?.error?.message || error.message || 'Erro ao carregar agendas',
              })
            )
          )
        )
      )
    )
  );

  readonly createAppointment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentActions.createAppointment),
      switchMap(({ payload }) =>
        this.appointmentService.create(payload).pipe(
          map((appointment) =>
            AppointmentActions.createAppointmentSuccess({ appointment })
          ),
          catchError((error) =>
  of(
    AppointmentActions.createAppointmentFailure({
      error: this.getErrorMessage(error),
    })
  )
)
        )
      )
    )
  );

  readonly updateAppointment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentActions.updateAppointment),
      switchMap(({ id, payload }) =>
        this.appointmentService.update(id, payload).pipe(
          map((appointment) =>
            AppointmentActions.updateAppointmentSuccess({ appointment })
          ),
          catchError((error) =>
  of(
    AppointmentActions.updateAppointmentFailure({
      error: this.getErrorMessage(error),
    })
  )
)
        )
      )
    )
  );

  readonly deleteAppointment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentActions.deleteAppointment),
      switchMap(({ id }) =>
        this.appointmentService.delete(id).pipe(
          map(() => AppointmentActions.deleteAppointmentSuccess({ id })),
          catchError((error) =>
            of(
              AppointmentActions.deleteAppointmentFailure({
                error: error?.error?.message || error.message || 'Erro ao excluir agenda',
              })
            )
          )
        )
      )
    )
  );

  readonly confirmAppointment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentActions.confirmAppointment),
      switchMap(({ id }) =>
        this.appointmentService.confirm(id).pipe(
          map((appointment) =>
            AppointmentActions.confirmAppointmentSuccess({ appointment })
          ),
          catchError((error) =>
            of(
              AppointmentActions.confirmAppointmentFailure({
                error: error?.error?.message || error.message || 'Erro ao confirmar agenda',
              })
            )
          )
        )
      )
    )
  );

  readonly cancelAppointment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentActions.cancelAppointment),
      switchMap(({ id }) =>
        this.appointmentService.cancel(id).pipe(
          map((appointment) =>
            AppointmentActions.cancelAppointmentSuccess({ appointment })
          ),
          catchError((error) =>
            of(
              AppointmentActions.cancelAppointmentFailure({
                error: error?.error?.message || error.message || 'Erro ao cancelar agenda',
              })
            )
          )
        )
      )
    )
  );
}