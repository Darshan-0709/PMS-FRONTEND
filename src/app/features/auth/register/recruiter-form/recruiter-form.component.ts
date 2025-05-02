import {
  Component,
  inject,
  output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  defaultValidationMessages,
  ValidationMessages,
} from '../../../../shared/types/validation.types';
import { SharedInputComponent } from '../../../../shared/components/shared-input/shared-input.component';
import { ValidationErrorsComponent } from '../../../../shared/components/validation-errors/validation-errors.component';
import { RegisterService } from '../register.service';
import { Observable, catchError, throwError, tap } from 'rxjs';

type RecruiterFormType = {
  companyName: FormControl<string>;
  representativePosition: FormControl<string>;
  description: FormControl<string>;
  website: FormControl<string>;
  companyEmail: FormControl<string>;
};

@Component({
  selector: 'app-recruiter-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SharedInputComponent,
    ValidationErrorsComponent,
  ],
  templateUrl: './recruiter-form.component.html',
  styleUrl: './recruiter-form.component.css',
})
export class RecruiterFormComponent {
  private fb = inject(FormBuilder);
  private registerService = inject(RegisterService);

  registrationSuccess = output<{ message: string }>();

  recruiterForm: FormGroup<RecruiterFormType>;
  validationMessages: ValidationMessages = {
    ...defaultValidationMessages,
    pattern: () => 'Please enter a valid website URL (e.g. https://...)',
  };

  constructor() {
    this.recruiterForm = this.fb.group<RecruiterFormType>({
      companyName: this.fb.control('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)],
      }),
      representativePosition: this.fb.control('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)],
      }),
      description: this.fb.control('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(10)],
      }),
      website: this.fb.control('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern('https?://.+')],
      }),
      companyEmail: this.fb.control('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
    });

    // Load saved data if exists
    const savedData = this.registerService.profileFormData();
    if (savedData) {
      this.recruiterForm.patchValue(savedData);
    }
  }

  get companyName() {
    return this.recruiterForm.get('companyName') as FormControl;
  }

  get representativePosition() {
    return this.recruiterForm.get('representativePosition') as FormControl;
  }

  get description() {
    return this.recruiterForm.get('description') as FormControl;
  }

  get website() {
    return this.recruiterForm.get('website') as FormControl;
  }

  get companyEmail() {
    return this.recruiterForm.get('companyEmail') as FormControl;
  }

  onSubmit() {
    if (this.recruiterForm.invalid) {
      this.recruiterForm.markAllAsTouched();
      return;
    }

    const formData = this.recruiterForm.getRawValue();
    this.registerService.setProfileFormData(formData);

    this.registerService.submitRegistration().pipe(
      tap((response) => {
        console.log('Registration succeeded with response:', response);
        this.registrationSuccess.emit(response.message);
      }),
      catchError((err) => {
        console.log('errror');
        Object.entries(err).forEach(([key, message]) => {
          const control = this.recruiterForm.get(key);
          if (control) {
            control.setErrors({ server: message });
            control.markAsTouched();
            control.markAsDirty();
          } else {
            this.recruiterForm.setErrors({ [key]: message });
          }
        });
        return throwError(() => err);
      })
    ).subscribe();
  }
}
