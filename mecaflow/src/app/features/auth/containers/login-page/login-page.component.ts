import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { LoginFormData } from '../../models/auth.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [LoginFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly devMode = environment.devMode;

  onLogin(credentials: LoginFormData): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService.login(credentials).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (error: { status: number }) => {
        this.loading.set(false);
        if (error.status === 401) {
          this.errorMessage.set('E-mail ou senha incorretos. Tente novamente.');
        } else if (error.status === 429) {
          this.errorMessage.set('Muitas tentativas. Tente novamente mais tarde.');
        } else {
          this.errorMessage.set('Erro inesperado. Tente novamente.');
        }
      },
    });
  }

  onDevLogin(): void {
    this.authService.devLogin();
    this.router.navigate(['/dashboard']);
  }

  onNavigateToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }
}
