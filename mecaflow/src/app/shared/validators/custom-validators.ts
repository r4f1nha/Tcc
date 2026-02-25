import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  /**
   * Validates Brazilian CPF (Cadastro de Pessoas Fisicas).
   * Accepts format: 000.000.000-00 or 00000000000
   */
  static cpf(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string | null;
    if (!value) {
      return null;
    }

    const cpf = value.replace(/\D/g, '');

    if (cpf.length !== 11) {
      return { cpf: { message: 'CPF deve conter 11 digitos' } };
    }

    // Reject known invalid patterns (all same digits)
    if (/^(\d)\1{10}$/.test(cpf)) {
      return { cpf: { message: 'CPF invalido' } };
    }

    // Validate first check digit
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i), 10) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9), 10)) {
      return { cpf: { message: 'CPF invalido' } };
    }

    // Validate second check digit
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i), 10) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(10), 10)) {
      return { cpf: { message: 'CPF invalido' } };
    }

    return null;
  }

  /**
   * Validates Brazilian CNPJ (Cadastro Nacional da Pessoa Juridica).
   * Accepts format: 00.000.000/0000-00 or 00000000000000
   */
  static cnpj(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string | null;
    if (!value) {
      return null;
    }

    const cnpj = value.replace(/\D/g, '');

    if (cnpj.length !== 14) {
      return { cnpj: { message: 'CNPJ deve conter 14 digitos' } };
    }

    // Reject known invalid patterns
    if (/^(\d)\1{13}$/.test(cnpj)) {
      return { cnpj: { message: 'CNPJ invalido' } };
    }

    // Validate first check digit
    const firstWeights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cnpj.charAt(i), 10) * firstWeights[i];
    }
    let remainder = sum % 11;
    const firstDigit = remainder < 2 ? 0 : 11 - remainder;
    if (parseInt(cnpj.charAt(12), 10) !== firstDigit) {
      return { cnpj: { message: 'CNPJ invalido' } };
    }

    // Validate second check digit
    const secondWeights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    sum = 0;
    for (let i = 0; i < 13; i++) {
      sum += parseInt(cnpj.charAt(i), 10) * secondWeights[i];
    }
    remainder = sum % 11;
    const secondDigit = remainder < 2 ? 0 : 11 - remainder;
    if (parseInt(cnpj.charAt(13), 10) !== secondDigit) {
      return { cnpj: { message: 'CNPJ invalido' } };
    }

    return null;
  }

  /**
   * Validates Brazilian phone numbers.
   * Accepts: (00) 00000-0000, (00) 0000-0000, or plain digits (10 or 11 digits)
   */
  static phone(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string | null;
    if (!value) {
      return null;
    }

    const phone = value.replace(/\D/g, '');

    if (phone.length < 10 || phone.length > 11) {
      return { phone: { message: 'Telefone deve conter 10 ou 11 digitos' } };
    }

    // Area code cannot start with 0
    if (phone.charAt(0) === '0') {
      return { phone: { message: 'DDD invalido' } };
    }

    // If 11 digits, the 3rd digit (first of the number) must be 9 (mobile)
    if (phone.length === 11 && phone.charAt(2) !== '9') {
      return { phone: { message: 'Numero de celular deve comecar com 9' } };
    }

    return null;
  }

  /**
   * Validates password strength:
   * - Minimum 8 characters
   * - At least one uppercase letter
   * - At least one lowercase letter
   * - At least one number
   * - At least one special character
   */
  static strongPassword(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string | null;
    if (!value) {
      return null;
    }

    const errors: Record<string, string> = {};

    if (value.length < 8) {
      errors['minLength'] = 'Senha deve ter pelo menos 8 caracteres';
    }
    if (!/[A-Z]/.test(value)) {
      errors['uppercase'] = 'Senha deve conter pelo menos uma letra maiuscula';
    }
    if (!/[a-z]/.test(value)) {
      errors['lowercase'] = 'Senha deve conter pelo menos uma letra minuscula';
    }
    if (!/\d/.test(value)) {
      errors['digit'] = 'Senha deve conter pelo menos um numero';
    }
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) {
      errors['special'] = 'Senha deve conter pelo menos um caractere especial';
    }

    return Object.keys(errors).length > 0 ? { strongPassword: errors } : null;
  }

  /**
   * Validates that two fields match (e.g., password and confirm password).
   * Apply this validator to the FormGroup, not to individual controls.
   *
   * Usage:
   * ```ts
   * new FormGroup({
   *   password: new FormControl(''),
   *   confirmPassword: new FormControl('')
   * }, { validators: CustomValidators.matchFields('password', 'confirmPassword') })
   * ```
   */
  static matchFields(field1: string, field2: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const control1 = group.get(field1);
      const control2 = group.get(field2);

      if (!control1 || !control2) {
        return null;
      }

      if (control1.value !== control2.value) {
        control2.setErrors({ ...control2.errors, matchFields: { message: 'Os campos nao coincidem' } });
        return { matchFields: { message: 'Os campos nao coincidem' } };
      }

      // Remove only the matchFields error if it exists
      if (control2.errors) {
        const { matchFields: _, ...remainingErrors } = control2.errors;
        const hasOtherErrors = Object.keys(remainingErrors).length > 0;
        control2.setErrors(hasOtherErrors ? remainingErrors : null);
      }

      return null;
    };
  }
}
