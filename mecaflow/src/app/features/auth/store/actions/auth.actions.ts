import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from '../../../../core/auth/models/user.model';
import { LoginFormData } from '../../models/auth-form.model';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    // Login
    'Login': props<{ credentials: LoginFormData }>(),
    'Login Success': props<{ user: User }>(),
    'Login Failure': props<{ error: string }>(),

    // Logout
    'Logout': emptyProps(),

    // Forgot Password
    'Forgot Password': props<{ email: string }>(),
    'Forgot Password Success': props<{ message: string }>(),
    'Forgot Password Failure': props<{ error: string }>(),

    // Reset Password
    'Reset Password': props<{ token: string; password: string }>(),
    'Reset Password Success': props<{ message: string }>(),
    'Reset Password Failure': props<{ error: string }>(),

    // Validate Reset Token
    'Validate Reset Token': props<{ token: string }>(),
    'Validate Reset Token Success': props<{ email: string }>(),
    'Validate Reset Token Failure': props<{ error: string }>(),

    // Clear errors
    'Clear Error': emptyProps(),
  },
});
