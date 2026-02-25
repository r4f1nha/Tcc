import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { AuthFeatureService } from '../../services/auth-feature.service';
import { AuthActions } from '../actions/auth.actions';
import { LoginRequest } from '../../../../core/auth/models/user.model';

export const loginEffect = createEffect(
  (
    actions$ = inject(Actions),
    authService = inject(AuthService),
  ) =>
    actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(({ credentials }) => {
        const loginRequest: LoginRequest = {
          email: credentials.email,
          password: credentials.password,
        };
        return authService.login(loginRequest).pipe(
          map((response) => AuthActions.loginSuccess({ user: response.user })),
          catchError((error: { status: number }) => {
            let errorMessage: string;
            if (error.status === 401) {
              errorMessage = 'E-mail ou senha incorretos. Tente novamente.';
            } else if (error.status === 429) {
              errorMessage = 'Muitas tentativas de login. Tente novamente mais tarde.';
            } else {
              errorMessage = 'Ocorreu um erro inesperado. Tente novamente.';
            }
            return of(AuthActions.loginFailure({ error: errorMessage }));
          }),
        );
      }),
    ),
  { functional: true },
);

export const loginSuccessEffect = createEffect(
  (
    actions$ = inject(Actions),
    router = inject(Router),
    toastService = inject(ToastService),
  ) =>
    actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(() => {
        toastService.success('Login realizado com sucesso!');
        router.navigate(['/dashboard']);
      }),
    ),
  { functional: true, dispatch: false },
);

export const loginFailureEffect = createEffect(
  (
    actions$ = inject(Actions),
    toastService = inject(ToastService),
  ) =>
    actions$.pipe(
      ofType(AuthActions.loginFailure),
      tap(({ error }) => {
        toastService.error(error);
      }),
    ),
  { functional: true, dispatch: false },
);

export const logoutEffect = createEffect(
  (
    actions$ = inject(Actions),
    authService = inject(AuthService),
  ) =>
    actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        authService.logout();
      }),
    ),
  { functional: true, dispatch: false },
);

export const forgotPasswordEffect = createEffect(
  (
    actions$ = inject(Actions),
    authFeatureService = inject(AuthFeatureService),
  ) =>
    actions$.pipe(
      ofType(AuthActions.forgotPassword),
      exhaustMap(({ email }) =>
        authFeatureService.forgotPassword(email).pipe(
          map((response) =>
            AuthActions.forgotPasswordSuccess({
              message: response.message ?? 'Se uma conta com este e-mail existir, enviamos um link de recuperacao.',
            }),
          ),
          catchError(() =>
            of(
              AuthActions.forgotPasswordFailure({
                error: 'Nao foi possivel processar sua solicitacao. Tente novamente mais tarde.',
              }),
            ),
          ),
        ),
      ),
    ),
  { functional: true },
);

export const forgotPasswordSuccessEffect = createEffect(
  (
    actions$ = inject(Actions),
    toastService = inject(ToastService),
  ) =>
    actions$.pipe(
      ofType(AuthActions.forgotPasswordSuccess),
      tap(({ message }) => {
        toastService.success(message);
      }),
    ),
  { functional: true, dispatch: false },
);

export const forgotPasswordFailureEffect = createEffect(
  (
    actions$ = inject(Actions),
    toastService = inject(ToastService),
  ) =>
    actions$.pipe(
      ofType(AuthActions.forgotPasswordFailure),
      tap(({ error }) => {
        toastService.error(error);
      }),
    ),
  { functional: true, dispatch: false },
);

export const resetPasswordEffect = createEffect(
  (
    actions$ = inject(Actions),
    authFeatureService = inject(AuthFeatureService),
  ) =>
    actions$.pipe(
      ofType(AuthActions.resetPassword),
      exhaustMap(({ token, password }) =>
        authFeatureService.resetPassword(token, password).pipe(
          map((response) =>
            AuthActions.resetPasswordSuccess({
              message: response.message ?? 'Senha redefinida com sucesso!',
            }),
          ),
          catchError((error: { status: number }) => {
            let errorMessage: string;
            if (error.status === 400) {
              errorMessage = 'Token invalido ou expirado. Solicite um novo link de recuperacao.';
            } else {
              errorMessage = 'Nao foi possivel redefinir sua senha. Tente novamente.';
            }
            return of(AuthActions.resetPasswordFailure({ error: errorMessage }));
          }),
        ),
      ),
    ),
  { functional: true },
);

export const resetPasswordSuccessEffect = createEffect(
  (
    actions$ = inject(Actions),
    router = inject(Router),
    toastService = inject(ToastService),
  ) =>
    actions$.pipe(
      ofType(AuthActions.resetPasswordSuccess),
      tap(({ message }) => {
        toastService.success(message);
        router.navigate(['/login']);
      }),
    ),
  { functional: true, dispatch: false },
);

export const resetPasswordFailureEffect = createEffect(
  (
    actions$ = inject(Actions),
    toastService = inject(ToastService),
  ) =>
    actions$.pipe(
      ofType(AuthActions.resetPasswordFailure),
      tap(({ error }) => {
        toastService.error(error);
      }),
    ),
  { functional: true, dispatch: false },
);

export const validateResetTokenEffect = createEffect(
  (
    actions$ = inject(Actions),
    authFeatureService = inject(AuthFeatureService),
  ) =>
    actions$.pipe(
      ofType(AuthActions.validateResetToken),
      exhaustMap(({ token }) =>
        authFeatureService.validateResetToken(token).pipe(
          map((response) =>
            AuthActions.validateResetTokenSuccess({ email: response.email }),
          ),
          catchError(() =>
            of(
              AuthActions.validateResetTokenFailure({
                error: 'Token invalido ou expirado. Solicite um novo link de recuperacao.',
              }),
            ),
          ),
        ),
      ),
    ),
  { functional: true },
);

export const validateResetTokenFailureEffect = createEffect(
  (
    actions$ = inject(Actions),
    toastService = inject(ToastService),
  ) =>
    actions$.pipe(
      ofType(AuthActions.validateResetTokenFailure),
      tap(({ error }) => {
        toastService.error(error);
      }),
    ),
  { functional: true, dispatch: false },
);
