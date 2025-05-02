import { Component, effect, input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ValidationErrorsComponent } from '../validation-errors/validation-errors.component';
import { ValidationMessages } from '../../types/validation.types';

@Component({
  selector: 'app-shared-input',
  standalone: true,
  imports: [ReactiveFormsModule, ValidationErrorsComponent],
  templateUrl: './shared-input.component.html',
  styleUrl: './shared-input.component.css',
})
export class SharedInputComponent {
  control = input.required<FormControl>();
  label = input.required<string>();
  type = input<string>('text');
  placeholder = input<string>('');

  constructor() {
    // Watch for control changes
    effect(() => {
      const ctrl = this.control();
      const label = this.label();

      // Subscribe to value changes
      // ctrl.valueChanges.subscribe((value) => {
      //   console.log(`[SharedInput] Value changed for ${label}:`, {
      //     value: value,
      //     touched: ctrl.touched,
      //     dirty: ctrl.dirty,
      //     errors: ctrl.errors,
      //     valid: ctrl.valid,
      //   });
      // });

      // // Subscribe to status changes
      // ctrl.statusChanges.subscribe((status) => {
      //   console.log(`[SharedInput] Status changed for ${label}:`, {
      //     status: status,
      //     touched: ctrl.touched,
      //     dirty: ctrl.dirty,
      //     errors: ctrl.errors,
      //     valid: ctrl.valid,
      //   });
      // });
    });
  }
}
