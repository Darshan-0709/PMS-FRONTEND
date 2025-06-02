import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SharedInputComponent } from '../shared/components/shared-input/shared-input.component';
import { ValidationErrorsComponent } from '../shared/components/validation-errors/validation-errors.component';
import { ToastComponent } from '../shared/components/toast/toast.component';
import { defaultValidationMessages, ValidationMessages } from '../types/validation.types';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { ApiResponse } from '../types/api-response.types';
import { AuthResponse, LoginRequest } from '../types/auth.types';

type LoginFormType = {
  email: FormControl<string>;
  password: FormControl<string>;
};

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedInputComponent,
    ValidationErrorsComponent,
    RouterModule,
    ToastComponent,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup<LoginFormType>;
  isLoading = false;
  errorMessage = '';

  validationMessages: ValidationMessages = {
    ...defaultValidationMessages,
    required: (_, label = 'This field') => `${label} is required`,
    email: () => 'Please enter a valid email address',
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.loginForm = this.fb.group<LoginFormType>({
      email: this.fb.control('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: this.fb.control('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });

    // Check for success message from previous navigation (like registration success)
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && 'successMessage' in navigation.extras.state) {
      const message = navigation.extras.state['successMessage'] as string;
      this.toastService.show(message, 'success');
    }
  }

  get emailControl(): FormControl<string> {
    return this.loginForm.get('email') as FormControl<string>;
  }

  get passwordControl(): FormControl<string> {
    return this.loginForm.get('password') as FormControl<string>;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const credentials: LoginRequest = {
        email: this.loginForm.value.email!,
        password: this.loginForm.value.password!,
      };

      this.authService.login(credentials).subscribe({
        next: (response: ApiResponse<AuthResponse>) => {
          this.isLoading = false;
          if (response.success && response.data) {
            // Show success toast
            this.toastService.show('Login successful!', 'success');
            this.authService.redirectBasedOnRole();
          }
        },
        error: error => {
          this.isLoading = false;
          const errorMessage = error.error?.message || 'Login failed. Please try again.';
          this.errorMessage = errorMessage;
          // Show error toast
          this.toastService.show(errorMessage, 'error');
        },
      });
    }
  }
}
