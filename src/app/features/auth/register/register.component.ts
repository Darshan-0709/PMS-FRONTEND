import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterService } from './register.service';
import { UserFormComponent } from './user-form/user-form.component';
import { RecruiterFormComponent } from './recruiter-form/recruiter-form.component';
import { Router, RouterModule } from '@angular/router';
import { StudentFormComponent } from './student-form/student-form.component';
import { PlacementCellFormComponent } from './placement-cell-form/placement-cell-form.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RoleSelectButtonComponent } from "../../../shared/components/role-select-button/role-select-button.component";

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
],
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private registerService = inject(RegisterService);
  private router = inject(Router);
  registrationForm!: FormGroup;

  currentStep = this.registerService.currentStep;
  selectedRole = this.registerService.selectedRole;
  errors = this.registerService.errors;
  showSuccessMessage = false;
  successMessage = '';

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
  }

  get studentForm() {
    return this.registrationForm.get('studentForm') as FormGroup;
  }

  onSubmit() {
    // // Ensure the entire registration form is valid
    console.log(this.registrationForm.getRawValue());
    if (this.registrationForm.invalid) {
      console.log('Parent Form Group Errors:', this.registrationForm.errors);

      this.registrationForm.markAllAsTouched();
      console.log('return');
      return;
    }

    this.registerService.submitRegistration().subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.showSuccessMessage = true;
        this.successMessage = 'Registration completed successfully!';
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 3000);
      },
      error: (error) => {
        console.error('Registration failed:', error);
      },
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
    console.log('Success');

    setTimeout(() => {
      this.router.navigate(['/auth/login']);
    }, 3000);
  }
}
