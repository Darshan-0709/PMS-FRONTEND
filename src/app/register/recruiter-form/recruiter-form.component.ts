import { Component, inject, OnInit, output } from '@angular/core';
import {
  ControlContainer,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RecruiterProfileData } from '../register.models';
import { SharedInputComponent } from '../../shared/components/shared-input/shared-input.component';
import { ValidationErrorsComponent } from '../../shared/components/validation-errors/validation-errors.component';
import { defaultValidationMessages, ValidationMessages } from '../../types/validation.types';
import { RegisterService } from '../../services/register.service';

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
  imports: [ReactiveFormsModule, SharedInputComponent, ValidationErrorsComponent],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
  templateUrl: './recruiter-form.component.html',
  styleUrl: './recruiter-form.component.css',
})
export class RecruiterFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private registerService = inject(RegisterService);
  parentContainer = inject(ControlContainer);

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  registrationSuccess = output<{ message: string }>();

  // recruiterForm: FormGroup<RecruiterFormType>;
  validationMessages: ValidationMessages = {
    ...defaultValidationMessages,
    pattern: () => 'Please enter a valid website URL (e.g. https://...)',
  };

  ngOnInit(): void {
    const recruiterForm = this.fb.group<RecruiterFormType>({
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
        validators: [Validators.required, Validators.pattern(/^https?:\/\/[^\s$.?#].[^\s]*$/)],
      }),
      companyEmail: this.fb.control('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
    });
    this.parentFormGroup.addControl('recruiterForm', recruiterForm);
    const savedData = this.registerService.recruiterProfile();
    recruiterForm.valueChanges.subscribe(val => {
      if (
        (val.companyEmail !== undefined &&
          val.companyName !== undefined &&
          val.description !== undefined &&
          val.representativePosition !== undefined,
        val.website !== undefined)
      ) {
        this.registerService.setRecruiterProfile(val as RecruiterProfileData);
      }
    });
    if (savedData) {
      recruiterForm.patchValue(savedData);
    }
  }

  get recruiterForm() {
    return this.parentFormGroup.get('recruiterForm') as FormGroup;
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
}
