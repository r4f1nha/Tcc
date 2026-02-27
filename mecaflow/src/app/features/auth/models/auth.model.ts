export interface LoginFormData {
  email: string;
  password: string;
}

export interface ResetPasswordFormData {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}
