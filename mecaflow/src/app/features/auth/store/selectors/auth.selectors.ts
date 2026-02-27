import { authFeature } from '../reducers/auth.reducer';

export const {
  selectLoading: selectAuthLoading,
  selectError: selectAuthError,
  selectFormStatus: selectAuthFormStatus,
  selectResetPasswordSent: selectResetPasswordSent,
  selectResetPasswordSuccess: selectResetPasswordSuccess,
  selectResetTokenValid: selectResetTokenValid,
  selectResetTokenEmail: selectResetTokenEmail,
  selectSuccessMessage: selectAuthSuccessMessage,
} = authFeature;
