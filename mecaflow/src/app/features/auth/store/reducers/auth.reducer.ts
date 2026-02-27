import { createFeature, createReducer, on } from '@ngrx/store';
import { AuthActions } from '../actions/auth.actions';
import { AuthFormStatus } from '../../models/auth-form.model';

export interface AuthState {
  readonly loading: boolean;
  readonly error: string | null;
  readonly formStatus: AuthFormStatus;
  readonly resetPasswordSent: boolean;
  readonly resetPasswordSuccess: boolean;
  readonly resetTokenValid: boolean;
  readonly resetTokenEmail: string | null;
  readonly successMessage: string | null;
}

const initialState: AuthState = {
  loading: false,
  error: null,
  formStatus: AuthFormStatus.IDLE,
  resetPasswordSent: false,
  resetPasswordSuccess: false,
  resetTokenValid: false,
  resetTokenEmail: null,
  successMessage: null,
};

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,

    // Login
    on(AuthActions.login, (state): AuthState => ({
      ...state,
      loading: true,
      error: null,
      formStatus: AuthFormStatus.SUBMITTING,
    })),
    on(AuthActions.loginSuccess, (state): AuthState => ({
      ...state,
      loading: false,
      error: null,
      formStatus: AuthFormStatus.SUCCESS,
    })),
    on(AuthActions.loginFailure, (state, { error }): AuthState => ({
      ...state,
      loading: false,
      error,
      formStatus: AuthFormStatus.ERROR,
    })),

    // Logout
    on(AuthActions.logout, (): AuthState => ({
      ...initialState,
    })),

    // Forgot Password
    on(AuthActions.forgotPassword, (state): AuthState => ({
      ...state,
      loading: true,
      error: null,
      resetPasswordSent: false,
      successMessage: null,
      formStatus: AuthFormStatus.SUBMITTING,
    })),
    on(AuthActions.forgotPasswordSuccess, (state, { message }): AuthState => ({
      ...state,
      loading: false,
      error: null,
      resetPasswordSent: true,
      successMessage: message,
      formStatus: AuthFormStatus.SUCCESS,
    })),
    on(AuthActions.forgotPasswordFailure, (state, { error }): AuthState => ({
      ...state,
      loading: false,
      error,
      resetPasswordSent: false,
      formStatus: AuthFormStatus.ERROR,
    })),

    // Reset Password
    on(AuthActions.resetPassword, (state): AuthState => ({
      ...state,
      loading: true,
      error: null,
      resetPasswordSuccess: false,
      successMessage: null,
      formStatus: AuthFormStatus.SUBMITTING,
    })),
    on(AuthActions.resetPasswordSuccess, (state, { message }): AuthState => ({
      ...state,
      loading: false,
      error: null,
      resetPasswordSuccess: true,
      successMessage: message,
      formStatus: AuthFormStatus.SUCCESS,
    })),
    on(AuthActions.resetPasswordFailure, (state, { error }): AuthState => ({
      ...state,
      loading: false,
      error,
      resetPasswordSuccess: false,
      formStatus: AuthFormStatus.ERROR,
    })),

    // Validate Reset Token
    on(AuthActions.validateResetToken, (state): AuthState => ({
      ...state,
      loading: true,
      error: null,
      resetTokenValid: false,
      resetTokenEmail: null,
    })),
    on(AuthActions.validateResetTokenSuccess, (state, { email }): AuthState => ({
      ...state,
      loading: false,
      resetTokenValid: true,
      resetTokenEmail: email,
    })),
    on(AuthActions.validateResetTokenFailure, (state, { error }): AuthState => ({
      ...state,
      loading: false,
      error,
      resetTokenValid: false,
      resetTokenEmail: null,
    })),

    // Clear Error
    on(AuthActions.clearError, (state): AuthState => ({
      ...state,
      error: null,
      formStatus: state.formStatus === AuthFormStatus.ERROR ? AuthFormStatus.IDLE : state.formStatus,
    })),
  ),
});
