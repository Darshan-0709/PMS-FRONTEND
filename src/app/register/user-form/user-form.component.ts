import { Component, EventEmitter, inject, Output } from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { UserFormModel } from '../register.models';
import { SharedInputComponent } from '../../shared/components/shared-input/shared-input.component';
import { ValidationErrorsComponent } from '../../shared/components/validation-errors/validation-errors.component';
import { defaultValidationMessages, ValidationMessages } from '../../types/validation.types';
import { RegisterService } from '../../services/register.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SharedInputComponent, ValidationErrorsComponent],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',
})
export class UserFormComponent {
  private registerService = inject(RegisterService);

  parentContainer = inject(ControlContainer);

  currentStep = this.registerService.currentStep;
  emailDomainError = '';

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  validationMessages: ValidationMessages = {
    ...defaultValidationMessages,
    passwordsMismatch: () => 'Passwords do not match',
    emailDomain: () =>
      this.emailDomainError || 'Email domain is not allowed for the selected placement cell',
  };

  @Output() validationSuccess = new EventEmitter<void>();
  @Output() validationError = new EventEmitter<void>();

  ngOnInit() {
    const userGroup = new FormGroup(
      {
        email: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required, Validators.email],
        }),
        username: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required, Validators.minLength(3)],
        }),
        password: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required, Validators.minLength(6)],
        }),
        confirmPassword: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required, Validators.minLength(6)],
        }),
      },
      { validators: this.passwordMatchValidator }
    );
    this.parentFormGroup.addControl('userForm', userGroup);
    const savedData = this.registerService.userFormData();
    userGroup.valueChanges.subscribe(val => {
      if (
        val.email !== undefined &&
        val.username !== undefined &&
        val.password !== undefined &&
        val.confirmPassword !== undefined
      ) {
        this.registerService.setUserFormData(val as UserFormModel);
      }
    });
    if (savedData) {
      userGroup.patchValue(savedData);
    }
  }

  ngOnDestroy() {
    this.parentFormGroup.removeControl('userForm');
  }

  passwordMatchValidator: ValidatorFn = (ctrl): ValidationErrors | null => {
    const pw = ctrl.get('password')?.value;
    const cp = ctrl.get('confirmPassword');
    if (!cp) return null;
    return pw === cp.value
      ? (cp.setErrors(null), null)
      : (cp.setErrors({ passwordsMismatch: true }), null);
  };

  validateUserData() {
    // Log the entire form state for debugging
    const userForm = this.parentFormGroup.get('userForm') as FormGroup;
    if (userForm.invalid) {
      userForm.markAllAsTouched();
      return;
    }

    const data = userForm.getRawValue();
    if (data.email && data.username && data.password && data.confirmPassword) {
      this.registerService.setUserFormData(data);
      this.registerService.validateUserData(data).subscribe({
        next: () => this.validationSuccess.emit(),
        error: errors => {
          // If error is specifically about email domain, handle it specially
          if (errors?.email?.includes('email domain is not allowed')) {
            this.emailDomainError = errors.email;
            const emailControl = userForm.get('email');
            if (emailControl) {
              emailControl.setErrors({ emailDomain: true });
              emailControl.markAsTouched();
            }
          } else {
            // Handle other validation errors
            Object.entries(errors || {}).forEach(([key, msg]) => {
              const ctl = userForm.get(key);
              if (ctl) {
                ctl.setErrors({ server: msg });
                ctl.markAsTouched();
                ctl.markAsDirty();
              } else if (key !== 'general') {
                // For fields in this form
                userForm.setErrors({ [key]: msg });
              }
            });
          }
          this.validationError.emit();
        },
      });
    } else {
      userForm.setErrors({ incompleteForm: true });
      this.validationError.emit();
    }
  }

  get f() {
    return this.parentFormGroup.get('userForm') as FormGroup;
  }
  get email() {
    return this.f.get('email') as FormControl;
  }
  get username() {
    return this.f.get('username') as FormControl;
  }
  get password() {
    return this.f.get('password') as FormControl;
  }
  get confirmPassword() {
    return this.f.get('confirmPassword') as FormControl;
  }
}
