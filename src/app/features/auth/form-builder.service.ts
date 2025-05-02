import { Injectable } from '@angular/core';
import {
  PlacementCellProfileFormModel,
  RecruiterProfileFormModel,
  StudentProfileFormModel,
  UserFormModel, // Use UserFormModel for user registration
} from './register/register.models';
import { TypedFormGroup } from '../../shared/types/typedFormGroup';
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormBuilderService {
  constructor(private fb: FormBuilder) {}

  passwordMatchValidator(passwordControl: AbstractControl): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      if (passwordControl.value !== control.value) {
        return { passwordMismatch: true }; 
      }
      return null;
    };
  }

  createUserForm(): TypedFormGroup<UserFormModel> {
    const passwordControl = this.fb.control('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    });

    const confirmPasswordControl = this.fb.control('', {
      nonNullable: true,
      validators: [Validators.required, this.passwordMatchValidator(passwordControl)],
    });

    return this.fb.group({
      email: this.fb.control('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
      username: this.fb.control('', { nonNullable: true, validators: Validators.required }),
      password: passwordControl,
      confirmPassword: confirmPasswordControl,
    }) as TypedFormGroup<UserFormModel>;
  }

  createStudentProfileForm(): TypedFormGroup<StudentProfileFormModel> {
    return this.fb.group({
      enrollmentNumber: this.fb.control('', { nonNullable: true, validators: Validators.required }),
      fullName: this.fb.control('', { nonNullable: true, validators: Validators.required }),
      degreeId: this.fb.control('', { nonNullable: true, validators: Validators.required }),
      branchId: this.fb.control('', { nonNullable: true, validators: Validators.required }),
      placementCellId: this.fb.control('', { nonNullable: true, validators: Validators.required }),
      placementCellSearch: this.fb.control('', { nonNullable: true }),
    }) ;
  }

  createRecruiterProfileForm(): TypedFormGroup<RecruiterProfileFormModel> {
    return this.fb.group({
      companyName: this.fb.control('', { nonNullable: true, validators: Validators.required }),
      representativePosition: this.fb.control('', { nonNullable: true, validators: Validators.required }),
      description: this.fb.control('', { nonNullable: true }),
      website: this.fb.control('', { nonNullable: true, validators: Validators.required }),
      companyEmail: this.fb.control('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
    });
  }

  createPlacementCellProfileForm(): TypedFormGroup<PlacementCellProfileFormModel> {
    return this.fb.group({
      name: this.fb.control('', { nonNullable: true, validators: Validators.required }),
      domains: this.fb.control<string[]>([], { nonNullable: true, validators: Validators.required }),
      enteredDomain: this.fb.control('', { nonNullable: true }),
      branchName: this.fb.control('', { nonNullable: true, validators: Validators.required }),
      degreeNames: this.fb.control<string[]>([], { nonNullable: true, validators: Validators.required }),
      placementCellEmail: this.fb.control('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
      website: this.fb.control('', { nonNullable: true, validators: Validators.required }),
    });
  }
}
