import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { inject } from '@angular/core';
import { ResetPasswordFormData } from '../../models/auth.model';

@Component({
  selector: 'app-forgot-password-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);

  readonly loading = input(false);
  readonly successMessage = input<string | null>(null);
  readonly errorMessage = input<string | null>(null);

  readonly submitReset = output<ResetPasswordFormData>();
  readonly navigateToLogin = output<void>();

  readonly resetForm: FormGroup = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  onSubmit(): void {
    if (this.resetForm.valid) {
      const formData: ResetPasswordFormData = {
        email: this.resetForm.get('email')!.value as string,
      };
      this.submitReset.emit(formData);
    } else {
      this.resetForm.markAllAsTouched();
    }
  }

  onBackToLogin(): void {
    this.navigateToLogin.emit();
  }

  get emailInvalid(): boolean {
    const control = this.resetForm.get('email');
    return control !== null && control.invalid && control.touched;
  }

  get emailErrorMessage(): string {
    const control = this.resetForm.get('email');
    if (control?.hasError('required')) {
      return 'Email is required';
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    return '';
  }
}
