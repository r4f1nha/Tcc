import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ResetPasswordFormComponent } from '../../components/reset-password-form/reset-password-form.component';
import { ResetPasswordFormData } from '../../models/auth-form.model';
import { AuthActions } from '../../store/actions/auth.actions';
import {
  selectAuthError,
  selectAuthLoading,
  selectResetPasswordSuccess,
} from '../../store/selectors/auth.selectors';

@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [ResetPasswordFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reset-password-page.component.html',
})
export class ResetPasswordPageComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly loading = this.store.selectSignal(selectAuthLoading);
  readonly error = this.store.selectSignal(selectAuthError);
  readonly resetSuccess = this.store.selectSignal(selectResetPasswordSuccess);

  readonly token = signal<string>('');
  readonly tokenValid = signal(true);

  ngOnInit(): void {
    const tokenParam = this.route.snapshot.queryParamMap.get('token');
    if (!tokenParam) {
      this.tokenValid.set(false);
      return;
    }
    this.token.set(tokenParam);
  }

  onResetPassword(formData: ResetPasswordFormData): void {
    this.store.dispatch(
      AuthActions.resetPassword({
        token: this.token(),
        password: formData.password,
      }),
    );
  }

  onNavigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
