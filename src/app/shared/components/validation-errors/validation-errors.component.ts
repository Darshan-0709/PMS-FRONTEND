// shared/components/validation-errors/validation-errors.component.ts
import { Component, computed, effect, input } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { ValidationMessages } from '../../../types/validation.types';

@Component({
  selector: 'app-validation-errors',
  standalone: true,
  templateUrl: './validation-errors.component.html',
})
export class ValidationErrorsComponent {
  control = input.required<FormControl>();
  messages = input<ValidationMessages>({});
  label = input<string>('This field');

  shouldShowErrors() {
    const control = this.control();
    return (
      control && control.invalid && (control.dirty || control.touched || control.hasError('server'))
    );
  }

  getErrors() {
    const control = this.control();
    const messages = this.messages();
    const label = this.label();

    if (!control || !control.errors) {
      return [];
    }

    // Handle server errors first
    if (control.hasError('server')) {
      const serverError = control.getError('server');
      return [serverError];
    }

    // Handle validation errors
    return Object.keys(control.errors)
      .filter(key => key !== 'server' && messages[key])
      .map(key => {
        const msg = messages[key];
        return typeof msg === 'function' ? msg(control, label) : msg;
      });
  }
  constructor() {
    // setInterval(() => {
    //   console.log(this.shouldShowErrors())
    // }, 100);
    // effect(()=> {
    // })
  }
}
