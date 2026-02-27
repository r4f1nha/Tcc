import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { LoginFormData } from '../../models/auth-form.model';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent {
  private readonly fb = inject(FormBuilder);

  readonly loading = input(false);
  readonly errorMessage = input<string | null>(null);

  readonly submitLogin = output<LoginFormData>();
  readonly navigateToForgotPassword = output<void>();

  readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false],
  });

  readonly showPassword = signal(false);

  togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password, rememberMe } = this.loginForm.getRawValue();
      const formData: LoginFormData = { email, password, rememberMe };
      this.submitLogin.emit(formData);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  onForgotPassword(): void {
    this.navigateToForgotPassword.emit();
  }

  get emailInvalid(): boolean {
    const control = this.loginForm.controls.email;
    return control.invalid && control.touched;
  }

  get passwordInvalid(): boolean {
    const control = this.loginForm.controls.password;
    return control.invalid && control.touched;
  }

  get emailErrorMessage(): string {
    const control = this.loginForm.controls.email;
    if (control.hasError('required')) {
      return 'O e-mail e obrigatorio';
    }
    if (control.hasError('email')) {
      return 'Informe um e-mail valido';
    }
    return '';
  }

  get passwordErrorMessage(): string {
    const control = this.loginForm.controls.password;
    if (control.hasError('required')) {
      return 'A senha e obrigatoria';
    }
    if (control.hasError('minlength')) {
      return 'A senha deve ter pelo menos 6 caracteres';
    }
    return '';
  }
}
