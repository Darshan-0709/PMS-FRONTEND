import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterService } from './register.service';
import { RegisterBaseData } from '../user.mode';

type UserFormType = {
  email: FormControl<string>;
  username: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
};

@Component({
  selector: 'app-register',
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  onSubmit() {
    throw new Error('Method not implemented.');
  }
  step = signal(1);
  selectedRole: 'student' | 'placement_cell' | 'recruiter' | null = null;
  roleError = signal('');
  userForm: FormGroup<UserFormType>;
  profileForm: FormGroup;

  registerService = inject(RegisterService);

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group<UserFormType>(
      {
        email: this.fb.control('', {
          nonNullable: true,
          validators: [Validators.required, Validators.email],
        }),
        username: this.fb.control('', {
          nonNullable: true,
          validators: [Validators.required, Validators.minLength(3)],
        }),
        password: this.fb.control('', {
          nonNullable: true,
          validators: [Validators.required, Validators.minLength(6)],
        }),
        confirmPassword: this.fb.control('', {
          nonNullable: true,
          validators: [Validators.required, Validators.minLength(6)],
        }),
      },
      { validators: this.passwordMatchValidator }
    );
    this.profileForm = this.fb.group({});
  }

  onRoleSelect(role: 'student' | 'placement_cell' | 'recruiter') {
    if (!role) {
      this.onHandleRoleError('Please select role');
      return;
    }
    this.selectedRole = role;
    this.onNextStep();
  }

  get username() {
    return this.userForm.get('username');
  }
  get email() {
    return this.userForm.get('email');
  }
  get password() {
    return this.userForm.get('password');
  }
  get confirmPassword() {
    return this.userForm.get('confirmPassword');
  }
  get enrollmentNumber() {
    return this.profileForm.get('enrollmentNumber');
  }
  get fullName() {
    return this.profileForm.get('fullName');
  }
  get degreeId() {
    return this.profileForm.get('degreeId');
  }
  get placementCellId() {
    return this.profileForm.get('placementCellId');
  }
  get companyName() {
    return this.profileForm.get('companyName');
  }
  get representativePosition() {
    return this.profileForm.get('representativePosition');
  }
  get description() {
    return this.profileForm.get('description');
  }
  get website() {
    return this.profileForm.get('website');
  }
  get name() {
    return this.profileForm.get('name');
  }
  get domains() {
    return this.profileForm.get('domains');
  }
  get branchName() {
    return this.profileForm.get('branchName');
  }
  get degreeNames() {
    return this.profileForm.get('degreeNames');
  }

  passwordMatchValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const group = control as FormGroup;
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  };

  buildProfileForm() {
    if (this.selectedRole === 'student') {
      this.profileForm = this.fb.group({
        enrollmentNumber: ['', Validators.required],
        fullName: ['', Validators.required],
        degreeId: ['', Validators.required],
        placementCellId: ['', Validators.required],
      });
    } else if (this.selectedRole === 'recruiter') {
      this.profileForm = this.fb.group({
        companyName: ['', Validators.required],
        representativePosition: ['', Validators.required],
        description: [''],
        website: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
      });
    } else if (this.selectedRole === 'placement_cell') {
      this.profileForm = this.fb.group({
        name: ['', Validators.required],
        domains: [[], Validators.required],
        branchName: ['', Validators.required],
        degreeNames: [[], Validators.required],
        email: ['', [Validators.required, Validators.email]],
        website: ['', [Validators.required]],
      });
    }
  }

  onUserFormValidate() {
    if (this.userForm.invalid || this.selectedRole === null) {
      this.userForm.markAllAsTouched();
      return;
    }
    const { email, username, password, confirmPassword } =
      this.userForm.getRawValue();
    const payload: RegisterBaseData = {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      role: this.selectedRole!,
    };
    this.registerService.validateUserData(payload).subscribe({
      next: (response) => {
        console.log(response);
        this.buildProfileForm();
        this.onNextStep();
      },
      error: (error) => {
        for (const key in error) {
          if (error.hasOwnProperty(key)) {
            const message = error[key];
            console.log({ [key]: message });
            const formControl = this.userForm.get(key);
            if (formControl) {
              formControl.setErrors({ server: message });
            }
            if (key === 'role') {
              this.onHandleRoleError(message);
            }
          }
          console.log(this.userForm.getError('password'));
        }
      },
    });
  }

  onNextStep() {
    this.step.update((prevStep) => (prevStep === 3 ? 3 : prevStep + 1));
  }

  onHandleRoleError(serverRoleError: string) {
    this.step.set(1);
    this.roleError.set(serverRoleError);
  }

  onPreviousStep() {
    this.step.update((prevStep) => prevStep - 1 || 1);
  }
}
