import { Component, EventEmitter, inject, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedInputComponent } from '../../../../shared/components/shared-input/shared-input.component';
import { ValidationErrorsComponent } from '../../../../shared/components/validation-errors/validation-errors.component';
import {
  defaultValidationMessages,
  ValidationMessages,
} from '../../../../shared/types/validation.types';
import { RegisterService } from '../register.service';

type UserFormType = {
  email: FormControl<string>;
  username: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
};

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SharedInputComponent,
    ValidationErrorsComponent,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',
})
export class UserFormComponent {
  private fb = inject(FormBuilder);
  private registerService = inject(RegisterService);

  userForm: FormGroup<UserFormType>;
  validationMessages: ValidationMessages = {
    ...defaultValidationMessages,
    passwordsMismatch: () => 'Passwords do not match',
  };

  @Output() validationSuccess = new EventEmitter<void>();
  @Output() validationError = new EventEmitter<void>();

  constructor() {
    this.userForm = this.fb.group<UserFormType>(
      {
        email: this.fb.control('', {
          nonNullable: true,
          validators: [Validators.required, Validators.email],
        }),
        username: this.fb.control('', {
          nonNullable: true,
          validators: [Validators.required, Validators.minLength(3)],
        }),
        password: this.fb.control('', {
          nonNullable: true,
          validators: [Validators.required, Validators.minLength(6)],
        }),
        confirmPassword: this.fb.control('', {
          nonNullable: true,
          validators: [Validators.required, Validators.minLength(6)],
        }),
      },
      { validators: this.passwordMatchValidator }
    );

    // Load saved data if exists
    const savedData = this.registerService.userFormData();
    if (savedData) {
      this.userForm.patchValue(savedData);
    }
  }

  passwordMatchValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const formGroup = control as FormGroup;
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  };

  onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formData = this.userForm.getRawValue();
    this.registerService.setUserFormData(formData);

    this.registerService.validateUserData(formData).subscribe({
      next: () => this.validationSuccess.emit(),
      error: (errors) => {
        console.error('Validation error:', errors);
        Object.entries(errors).forEach(([key, message]) => {
          const control = this.userForm.get(key);
          if (control) {
            control.setErrors({ server: message });
            control.markAsTouched();
            control.markAsDirty();
          } else {
            this.userForm.setErrors({ [key]: message });
          }
        });
        this.validationError.emit();
      },
    });
  }

  get email() {
    return this.userForm.get('email') as FormControl;
  }

  get username() {
    return this.userForm.get('username') as FormControl;
  }

  get password() {
    return this.userForm.get('password') as FormControl;
  }

  get confirmPassword() {
    return this.userForm.get('confirmPassword') as FormControl;
  }
}
