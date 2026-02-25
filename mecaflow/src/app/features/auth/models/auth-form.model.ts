export interface LoginFormData {
  readonly email: string;
  readonly password: string;
  readonly rememberMe: boolean;
}

export interface ForgotPasswordFormData {
  readonly email: string;
}

export interface ResetPasswordFormData {
  readonly password: string;
  readonly confirmPassword: string;
}

export interface ForgotPasswordResponse {
  readonly message: string;
}

export interface ResetPasswordResponse {
  readonly message: string;
}

export interface ValidateResetTokenResponse {
  readonly valid: boolean;
  readonly email: string;
}

export enum AuthFormStatus {
  IDLE = 'IDLE',
  SUBMITTING = 'SUBMITTING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}
