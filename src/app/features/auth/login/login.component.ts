import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SharedInputComponent } from '../../../shared/components/shared-input/shared-input.component';
import { ValidationErrorsComponent } from '../../../shared/components/validation-errors/validation-errors.component';
import {
  defaultValidationMessages,
  ValidationMessages,
} from '../../../shared/types/validation.types';
import {
  AuthService,
  LoginCredentials,
} from '../../../core/services/auth.service';
import { AuthResponse } from '../../../shared/types/auth.types';
import { ApiResponse } from '../../../core/config/api.config';

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
    minlength: (c, label = 'This field') =>
      `${label} must be at least ${
        c.getError('minlength')?.requiredLength
      } characters`,
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group<LoginFormType>({
      email: this.fb.control('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: this.fb.control('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6)],
      }),
    });
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

      const credentials: LoginCredentials = {
        email: this.loginForm.value.email!,
        password: this.loginForm.value.password!,
      };

      this.authService.login(credentials).subscribe({
        next: (response: ApiResponse<AuthResponse>) => {
          this.isLoading = false;
          if (response.success && response.data) {
            console.log(
              'LoginComponent: Login successful, redirecting based on role'
            );
            this.authService.redirectBasedOnRole();
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage =
            error.error?.message || 'Login failed. Please try again.';
        },
      });
    }
  }
}
