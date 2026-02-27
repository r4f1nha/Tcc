import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { ForgotPasswordComponent } from '../../components/forgot-password/forgot-password.component';
import { ForgotPasswordResponse, ResetPasswordFormData } from '../../models/auth.model';

@Component({
  selector: 'app-forgot-password-page',
  standalone: true,
  imports: [ForgotPasswordComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './forgot-password-page.component.html',
})
export class ForgotPasswordPageComponent {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly successMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  onSubmitReset(data: ResetPasswordFormData): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.http
      .post<ForgotPasswordResponse>(`${environment.apiUrl}/auth/forgot-password`, data)
      .subscribe({
        next: (response) => {
          this.loading.set(false);
          this.successMessage.set(
            response.message ?? 'If an account with that email exists, we sent a recovery link.',
          );
        },
        error: () => {
          this.loading.set(false);
          this.errorMessage.set('Unable to process your request. Please try again later.');
        },
      });
  }

  onNavigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
