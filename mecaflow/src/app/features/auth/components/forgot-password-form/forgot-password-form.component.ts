import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ForgotPasswordFormData } from '../../models/auth-form.model';

@Component({
  selector: 'app-forgot-password-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './forgot-password-form.component.html',
})
export class ForgotPasswordFormComponent {
  private readonly fb = inject(FormBuilder);

  readonly loading = input(false);
  readonly successMessage = input<string | null>(null);
  readonly errorMessage = input<string | null>(null);

  readonly submitEmail = output<ForgotPasswordFormData>();
  readonly navigateToLogin = output<void>();

  readonly forgotPasswordForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      const { email } = this.forgotPasswordForm.getRawValue();
      this.submitEmail.emit({ email });
    } else {
      this.forgotPasswordForm.markAllAsTouched();
    }
  }

  onBackToLogin(): void {
    this.navigateToLogin.emit();
  }

  get emailInvalid(): boolean {
    const control = this.forgotPasswordForm.controls.email;
    return control.invalid && control.touched;
  }

  get emailErrorMessage(): string {
    const control = this.forgotPasswordForm.controls.email;
    if (control.hasError('required')) {
      return 'O e-mail e obrigatorio';
    }
    if (control.hasError('email')) {
      return 'Informe um e-mail valido';
    }
    return '';
  }
}
