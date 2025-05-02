import { AbstractControl } from '@angular/forms';

export type ValidationMessages = {
  [key: string]: string | ((control: AbstractControl, label?: string) => string);
};

export const defaultValidationMessages: ValidationMessages = {
  required: (_, label = 'This field') => `${label} is required.`,
  minlength: (c, label = 'This field') =>
    `${label} must be at least ${c.getError('minlength')?.requiredLength} characters.`,
  maxlength: (c, label = 'This field') =>
    `${label} must be at most ${c.getError('maxlength')?.requiredLength} characters.`,
  email: () => 'Please enter a valid Email.',
  server: c => c.getError('server'),
};