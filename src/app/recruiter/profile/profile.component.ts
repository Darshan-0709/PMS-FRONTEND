import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { AuthService } from '../../services/auth.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { defaultValidationMessages } from '../../types/validation.types';
import { FormGroup } from '@angular/forms';
import { RecruiterService } from '../../services/recruiter.service';
import { ToastService } from '../../services/toast.service';
import { Subject, takeUntil } from 'rxjs';
import { Recruiter, RecruiterUpdatePayload } from '../../types/recruiter.types';
import { SharedInputComponent } from '../../shared/components/shared-input/shared-input.component';
import { ValidationErrorsComponent } from '../../shared/components/validation-errors/validation-errors.component';

interface RecruiterForm {
  companyName: FormControl<string>;
  representativePosition: FormControl<string>;
  description: FormControl<string>;
  website: FormControl<string>;
  companyEmail: FormControl<string>;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ToastComponent,
    ReactiveFormsModule,
    SharedInputComponent,
    ValidationErrorsComponent,
  ],
  templateUrl: 'profile.component.html',
  // template: '<h1>Profile</h1>',
  styles: [],
})
export class ProfileComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private recruiterService = inject(RecruiterService);
  private toastService = inject(ToastService);
  private destroy$ = new Subject<void>();

  validationMessages = defaultValidationMessages;
  recruiterId = this.authService.currentUser()?.recruiterId;
  recruiterData: Recruiter | null = null;

  recruiterForm = new FormGroup<RecruiterForm>({
    companyName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    representativePosition: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    website: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^https?:\/\/[^\s$.?#].[^\s]*$/)],
    }),
    companyEmail: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  isEditMode = signal<boolean>(false);

  ngOnInit(): void {
    this.loadRecruiterData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadRecruiterData(): void {
    if (!this.recruiterId) return;

    this.recruiterService
      .getRecruiter(this.recruiterId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(profile => {
        this.recruiterData = profile;
        this.resetForm();
      });
  }

  private resetForm(): void {
    if (this.recruiterData) {
      this.recruiterForm.patchValue(this.recruiterData);
    }
  }

  onEdit(): void {
    this.isEditMode.set(true);
    this.toastService.show('Edit profile', 'info');
  }

  onCancel(): void {
    this.resetForm();
    this.isEditMode.set(false);
    this.toastService.show('Edit cancelled', 'warning');
  }

  onSubmit() {
    if (this.recruiterForm.invalid) {
      this.toastService.show('Please fill all required fields correctly', 'error');
      return;
    }

    if (!this.recruiterId) return;

    const updatePayload: RecruiterUpdatePayload = this.recruiterForm.getRawValue();

    this.recruiterService
      .updateRecruiter(this.recruiterId, updatePayload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: profile => {
          this.recruiterData = profile;
          this.resetForm();
          this.isEditMode.set(false);
          this.toastService.show('Profile updated', 'success');
        },
        error: errors => {
          Object.entries(errors || {}).forEach(([key, msg]) => {
            const ctl = this.recruiterForm.get(key);
            if (ctl) {
              ctl.setErrors({ server: msg });
              ctl.markAsTouched();
              ctl.markAsDirty();
            }
          });
        },
      });
  }

  get representativePositionControl(): FormControl {
    return this.recruiterForm.get('representativePosition') as FormControl;
  }

  get descriptionControl(): FormControl {
    return this.recruiterForm.get('description') as FormControl;
  }

  get websiteControl(): FormControl {
    return this.recruiterForm.get('website') as FormControl;
  }

  get companyEmailControl() {
    return this.recruiterForm.get('companyEmail') as FormControl;
  }

  get companyNameControl() {
    return this.recruiterForm.get('companyName') as FormControl;
  }
}
