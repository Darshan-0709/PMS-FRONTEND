import { Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserFormComponent } from './user-form/user-form.component';
import { RecruiterFormComponent } from './recruiter-form/recruiter-form.component';
import { Router, RouterModule } from '@angular/router';
import { StudentFormComponent } from './student-form/student-form.component';
import { PlacementCellFormComponent } from './placement-cell-form/placement-cell-form.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RoleSelectButtonComponent } from '../shared/components/role-select-button/role-select-button.component';
import { ToastComponent } from '../shared/components/toast/toast.component';
import { ToastService } from '../services/toast.service';
import { RegisterService } from '../services/register.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    UserFormComponent,
    RecruiterFormComponent,
    StudentFormComponent,
    ReactiveFormsModule,
    PlacementCellFormComponent,
    RoleSelectButtonComponent,
    RouterModule,
    ToastComponent,
  ],
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private registerService = inject(RegisterService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  registrationForm!: FormGroup;

  currentStep = this.registerService.currentStep;
  selectedRole = this.registerService.selectedRole;
  errors = this.registerService.errors;
  showSuccessMessage = false;
  successMessage = '';

  // Helper method to convert error object to array of messages for display
  getErrorMessages(): string[] {
    const errorObj = this.errors();
    if (!errorObj) return [];

    return Object.entries(errorObj).map(([key, value]) => {
      if (key === 'general' || key === 'submission') {
        return value;
      }
      return `${key}: ${value}`;
    });
  }

  // Helper method to check if errors exist
  hasErrors(): boolean {
    const errorObj = this.errors();
    return !!errorObj && Object.keys(errorObj).length > 0;
  }

  onRoleSelect(role: 'student' | 'placement_cell' | 'recruiter') {
    this.registerService.setRole(role);
    this.registerService.nextStep();
  }

  onUserFormValidationSuccess() {
    this.registerService.nextStep();
  }

  onUserFormValidationError() {
    // Errors are handled by the service
  }

  ngOnInit(): void {
    this.registrationForm = this.fb.group({});
    this.registerService.fetchData();
    // Clear any existing errors when component initializes
    this.registerService.clearErrors();
  }

  ngOnDestroy(): void {
    // Clear all data when component is destroyed
    this.registerService.clearAllData();
  }

  get studentForm() {
    return this.registrationForm.get('studentForm') as FormGroup;
  }

  onSubmit() {
    // Ensure the entire registration form is valid

    // Check if there's a domain mismatch error
    const studentForm = this.registrationForm.get('studentForm') as FormGroup;
    const hasDomainMismatch = studentForm?.errors?.['domainMismatch'] === true;

    // If form is invalid
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();

      // Show specific message for domain mismatch by applying it to a form control
      if (hasDomainMismatch) {
        const message =
          'Cannot submit registration with email domain mismatch. Please change your email.';
        // Show error toast
        this.toastService.show(message, 'error');

        // Access the user form email control and apply the error there
        const userForm = this.registrationForm.get('userForm') as FormGroup;
        if (userForm && userForm.get('email')) {
          const emailControl = userForm.get('email');
          emailControl?.setErrors({
            server: message,
          });
          emailControl?.markAsTouched();
        }
      }
      return;
    }

    this.registerService.submitRegistration().subscribe({
      next: response => {
        this.showSuccessMessage = true;
        this.successMessage = 'Registration completed successfully!';

        // Clear all data before redirecting
        this.registerService.clearAllData();

        // Redirect to login page after registration
        this.router.navigate(['/auth/login'], {
          state: {
            successMessage: 'Registration completed successfully! Please log in.',
          },
        });
      },
      error: error => {
        // Show error toast with a general message
        this.toastService.show('Registration failed. Please check the form for errors.', 'error');

        // Apply errors to specific form controls
        // The error is directly from the API service
        this.applyServerErrors(error);
      },
    });
  }

  // Method to apply server errors to specific form controls
  private applyServerErrors(errors: Record<string, string>) {
    Object.entries(errors).forEach(([key, message]) => {
      // Handle user form errors
      const userForm = this.registrationForm.get('userForm') as FormGroup;
      if (
        userForm &&
        (key === 'email' || key === 'username' || key === 'password' || key === 'confirmPassword')
      ) {
        const control = userForm.get(key);
        if (control) {
          control.setErrors({ server: message });
          control.markAsTouched();
          return;
        }
      }

      // Handle student form errors
      const studentForm = this.registrationForm.get('studentForm') as FormGroup;
      if (
        studentForm &&
        (key === 'enrollmentNumber' ||
          key === 'fullName' ||
          key === 'degreeId' ||
          key === 'placementCellId')
      ) {
        const control = studentForm.get(key);
        if (control) {
          control.setErrors({ server: message });
          control.markAsTouched();
          return;
        }
      }

      // Handle placement cell form errors
      const placementCellForm = this.registrationForm.get('placementCellForm') as FormGroup;
      if (
        placementCellForm &&
        (key === 'placementCellName' ||
          key === 'domains' ||
          key === 'branchName' ||
          key === 'degreeNames' ||
          key === 'placementCellEmail' ||
          key === 'website')
      ) {
        const control = placementCellForm.get(key);
        if (control) {
          control.setErrors({ server: message });
          control.markAsTouched();
          return;
        }
      }

      // Handle recruiter form errors
      const recruiterForm = this.registrationForm.get('recruiterForm') as FormGroup;
      if (
        recruiterForm &&
        (key === 'companyName' ||
          key === 'representativePosition' ||
          key === 'description' ||
          key === 'website' ||
          key === 'companyEmail')
      ) {
        const control = recruiterForm.get(key);
        if (control) {
          control.setErrors({ server: message });
          control.markAsTouched();
          return;
        }
      }

      // If we couldn't find a specific control, set it as a general error
      this.registerService.setErrors({ [key]: message });
    });
  }

  onNextStep() {
    this.registerService.nextStep();
  }

  onPreviousStep() {
    this.registerService.previousStep();
  }

  onRegistrationSuccess(event: { message: string }) {
    this.showSuccessMessage = true;
    this.successMessage = event.message;

    // Show success toast
    this.toastService.show(event.message, 'success');

    // Clear all data before redirecting
    this.registerService.clearAllData();

    this.router.navigate(['/auth/login'], {
      state: { successMessage: event.message },
    });
  }
}
