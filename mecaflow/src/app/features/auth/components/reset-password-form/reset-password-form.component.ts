import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from '../../../../shared/validators/custom-validators';
import { ResetPasswordFormData } from '../../models/auth-form.model';

@Component({
  selector: 'app-reset-password-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reset-password-form.component.html',
})
export class ResetPasswordFormComponent {
  private readonly fb = inject(FormBuilder);

  readonly loading = input(false);
  readonly errorMessage = input<string | null>(null);
  readonly successMessage = input<string | null>(null);
  readonly tokenValid = input(true);

  readonly submitResetPassword = output<ResetPasswordFormData>();
  readonly navigateToLogin = output<void>();

  readonly resetPasswordForm = this.fb.nonNullable.group(
    {
      password: ['', [Validators.required, CustomValidators.strongPassword]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: CustomValidators.matchFields('password', 'confirmPassword'),
    },
  );

  readonly showPassword = signal(false);
  readonly showConfirmPassword = signal(false);

  togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update((v) => !v);
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid) {
      const { password, confirmPassword } = this.resetPasswordForm.getRawValue();
      this.submitResetPassword.emit({ password, confirmPassword });
    } else {
      this.resetPasswordForm.markAllAsTouched();
    }
  }

  onBackToLogin(): void {
    this.navigateToLogin.emit();
  }

  get passwordInvalid(): boolean {
    const control = this.resetPasswordForm.controls.password;
    return control.invalid && control.touched;
  }

  get confirmPasswordInvalid(): boolean {
    const control = this.resetPasswordForm.controls.confirmPassword;
    return control.invalid && control.touched;
  }

  get passwordErrorMessage(): string {
    const control = this.resetPasswordForm.controls.password;
    if (control.hasError('required')) {
      return 'A senha e obrigatoria';
    }
    if (control.hasError('strongPassword')) {
      const errors = control.getError('strongPassword') as Record<string, string>;
      const firstError = Object.values(errors)[0];
      return firstError ?? 'Senha invalida';
    }
    return '';
  }

  get confirmPasswordErrorMessage(): string {
    const control = this.resetPasswordForm.controls.confirmPassword;
    if (control.hasError('required')) {
      return 'A confirmacao de senha e obrigatoria';
    }
    if (control.hasError('matchFields')) {
      return 'As senhas nao coincidem';
    }
    return '';
  }

  get passwordStrengthHints(): ReadonlyArray<{ readonly label: string; readonly valid: boolean }> {
    const value = this.resetPasswordForm.controls.password.value;
    return [
      { label: 'Pelo menos 8 caracteres', valid: value.length >= 8 },
      { label: 'Letra maiuscula', valid: /[A-Z]/.test(value) },
      { label: 'Letra minuscula', valid: /[a-z]/.test(value) },
      { label: 'Um numero', valid: /\d/.test(value) },
      { label: 'Caractere especial', valid: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value) },
    ];
  }
}
