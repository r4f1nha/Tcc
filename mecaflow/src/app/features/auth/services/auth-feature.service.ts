import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  ForgotPasswordResponse,
  ResetPasswordResponse,
  ValidateResetTokenResponse,
} from '../models/auth-form.model';

@Injectable({ providedIn: 'root' })
export class AuthFeatureService {
  private readonly http = inject(HttpClient);
  private readonly authEndpoint = `${environment.apiUrl}/auth`;

  forgotPassword(email: string): Observable<ForgotPasswordResponse> {
    return this.http.post<ForgotPasswordResponse>(
      `${this.authEndpoint}/forgot-password`,
      { email },
    );
  }

  resetPassword(token: string, password: string): Observable<ResetPasswordResponse> {
    return this.http.post<ResetPasswordResponse>(
      `${this.authEndpoint}/reset-password`,
      { token, password },
    );
  }

  validateResetToken(token: string): Observable<ValidateResetTokenResponse> {
    return this.http.get<ValidateResetTokenResponse>(
      `${this.authEndpoint}/reset-password/validate`,
      { params: { token } },
    );
  }
}
