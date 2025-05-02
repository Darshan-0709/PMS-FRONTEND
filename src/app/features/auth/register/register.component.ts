import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterService } from './register.service';
import { RoleSelectButtonComponent } from '../../../shared/components/role-select-button/role-select-button.component';
import { UserFormComponent } from './user-form/user-form.component';
import { RecruiterFormComponent } from './recruiter-form/recruiter-form.component';
import { Router } from '@angular/router';
import { StudentFormComponent } from "./student-form/student-form.component";
import { PlacementCellFormComponent } from "./placement-cell-form/placement-cell-form.component";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RoleSelectButtonComponent,
    UserFormComponent,
    RecruiterFormComponent,
    StudentFormComponent,
    PlacementCellFormComponent
],
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  private registerService = inject(RegisterService);
  private router = inject(Router);

  // Computed signals from service
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
    this.registerService.fetchData()
  }

  async onSubmit() {
    try {
      await this.registerService.submitRegistration();
      // Handle successful registration
    } catch (error) {
      // Errors are handled by the service
    }
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
