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
import { RegisterService } from './register.service';
import {
  Branch,
  Degree,
  Domain,
  PlacementCellApiData,
  RegisterBaseData,
} from '../user.mode';
import { AutoCompleteComponent } from '../../../shared/components/auto-complete/auto-complete.component';
import { AlertModalComponent } from '../../../shared/components/alert-modal/alert-modal.component';
import { RoleSelectButtonComponent } from '../../../shared/components/role-select-button/role-select-button.component';

type UserFormType = {
  email: FormControl<string>;
  username: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
};

@Component({
  selector: 'app-register',
  imports: [
    RouterModule,
    ReactiveFormsModule,
    CommonModule,
    AutoCompleteComponent,
    AlertModalComponent,
    RoleSelectButtonComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  step = signal(1);

  selectedRole: 'student' | 'placement_cell' | 'recruiter' | null = null;
  roleError = signal('');
  emailError = signal<string | null>(null);
  selectedDegree = signal<string | null>(null);
  degreeSuggestions = signal<string[]>([]);
  userForm: FormGroup<UserFormType>;
  profileForm: FormGroup;
  registerService = inject(RegisterService);
  branches = signal<Branch[]>([]);
  degrees = signal<Degree[]>([]);
  placementCells = signal<PlacementCellApiData[]>([]);
  placementCellAutoCompleteList = signal<string[]>([]);
  placementCellDegreeAutoCompleteList = signal<string[]>([]);
  placementCellBranchAutoCompleteList = signal<string[]>([]);
  placementCellDegrees = signal<Degree[] | undefined>([]);
  placementCellAddedDegrees = signal<string[]>([]);
  placementCellAddedDomains = signal<string[]>([]);
  placementCellDomain = signal<Domain[] | undefined>([]);
  successfulRegister = signal<boolean>(false);

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
    const emailControl = this.userForm.get('email');
    if (emailControl) {
      emailControl.statusChanges.subscribe((status) => {
        console.log('Email control status changed:', status);
        console.log('Email control errors:', emailControl.errors);
      });
    }

    this.profileForm = this.fb.group({});
  }

  onRoleSelect(role: 'student' | 'placement_cell' | 'recruiter') {
    if (!role) {
      this.onHandleRoleError('Please select role');
      return;
    }
    this.selectedRole = role;
    this.onNextStep();
    if (role !== 'student') {
      this.profileForm.reset();
    }
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
    if (
      this.selectedRole === 'student' ||
      this.selectedRole === 'placement_cell'
    ) {
      this.registerService.fetchBranches().subscribe({
        next: (data) => {
          if (data) {
            this.branches.set(data);
            this.populatePlacementCellBranchesAutoCompleteList();
          }
        },
      });
      this.registerService.fetchPlacementCellDepartment().subscribe({
        next: (data) => {
          if (data) {
            this.placementCells.set(data);
            this.populatePlacementCellBranchesAutoCompleteList();
          }
        },
      });
    }
    if (this.selectedRole === 'student') {
      this.profileForm = this.fb.group({
        enrollmentNumber: ['', Validators.required],
        fullName: ['', Validators.required],
        degreeId: ['', Validators.required],
        branchId: ['', Validators.required],
        placementCellId: ['', Validators.required],
        placementCellSearch: [''],
      });
      this.profileForm.get('branchId')?.valueChanges.subscribe((branchId) => {
        if (branchId) {
          this.fetchPlacementCells(branchId);
        }
      });
    } else if (this.selectedRole === 'recruiter') {
      this.profileForm = this.fb.group({
        companyName: ['', Validators.required],
        representativePosition: ['', Validators.required],
        description: [''],
        website: ['', Validators.required],
        companyEmail: ['', [Validators.required, Validators.email]],
      });
    } else if (this.selectedRole === 'placement_cell') {
      this.profileForm = this.fb.group({
        name: ['', Validators.required],
        domains: [[], Validators.required],
        enteredDomain: [''],
        branchName: ['', Validators.required],
        degreeNames: [[], Validators.required],
        placementCellEmail: ['', [Validators.required, Validators.email]],
        website: ['', [Validators.required]],
      });

      // Reset the added degrees and domains when form is built
      this.placementCellAddedDegrees.set([]);
      this.placementCellAddedDomains.set([]);

      // Fetch degrees for auto-complete
      this.registerService.fetchDegrees().subscribe({
        next: (data) => {
          if (data) {
            this.degrees.set(data);
            this.populatePlacementCellDegreeAutoCompleteList();
          }
        },
      });
    }
  }

  fetchPlacementCells(branchId: string) {
    this.populatePlacementCellAutoCompleteList(branchId);
    this.placementCellId?.reset();
    this.degreeId?.reset();
  }

  populatePlacementCellAutoCompleteList(branchId: string) {
    const filteredPlacementCellNames: string[] = [];
    this.placementCells().forEach((placementCell) => {
      if (placementCell.branch.branchId === branchId) {
        filteredPlacementCellNames.push(placementCell.name);
      }
    });
    this.placementCellAutoCompleteList.set(filteredPlacementCellNames);
    this.placementCellId?.reset();
    this.placementCellDegrees.set(undefined);
    console.log(this.placementCellAutoCompleteList());
  }

  populatePlacementCellDegreeAutoCompleteList() {
    this.placementCellDegreeAutoCompleteList.set(
      this.degrees().map((degree) => degree.name)
    );
  }

  populatePlacementCellBranchesAutoCompleteList() {
    this.placementCellBranchAutoCompleteList.set(
      this.branches().map((branch) => branch.name)
    );
  }

  onUserFormValidate() {
    if (this.userForm.invalid || this.selectedRole === null) {
      this.userForm.markAllAsTouched();
      return;
    }
    const { email, username, password, confirmPassword } =
      this.userForm.getRawValue();
    const payload: RegisterBaseData = {
      email,
      username,
      password,
      confirmPassword,
      role: this.selectedRole!,
    };
    this.registerService.validateUserData(payload).subscribe({
      next: (response) => {
        console.log({ validations: response });
        this.buildProfileForm();
        this.onNextStep();
      },
      error: (error) => {
        console.log('Validation errors:', error);
        for (const key in error) {
          if (error.hasOwnProperty(key)) {
            const message = error[key];
            console.log({ key });
            if (key === 'email') {
              this.step.set(2);
              const emailControl = this.userForm.get('email');
              if (emailControl) {
                console.log(emailControl);
                emailControl.setErrors({ server: message });
                emailControl.markAsTouched();
                this.emailError.set(message);
              }
            } else {
              const formControl = this.userForm.get(key);
              if (formControl) {
                formControl.setErrors({ server: message });
              }
            }
            if (key === 'role') {
              this.onHandleRoleError(message);
            }
          }
        }
      },
    });
  }

  onRegisterSubmit() {
    console.log('Submitting');
    if (this.userForm.invalid || this.profileForm.invalid) {
      this.userForm.markAllAsTouched();
      this.profileForm.markAllAsTouched();
      return;
    }

    const { email, username, password, confirmPassword } =
      this.userForm.getRawValue();

    const userData = {
      email,
      username,
      password,
      confirmPassword,
      role: this.selectedRole!,
    };

    let profileData: any;

    switch (this.selectedRole) {
      case 'student':
        profileData = {
          studentProfileData: {
            enrollmentNumber: this.enrollmentNumber?.value,
            fullName: this.fullName?.value,
            degreeId: this.degreeId?.value,
            placementCellId: this.placementCellId?.value,
          },
        };
        break;

      case 'recruiter':
        profileData = {
          recruiterProfileData: {
            companyName: this.companyName?.value,
            representativePosition: this.representativePosition?.value,
            description: this.description?.value,
            website: this.website?.value,
            companyEmail: this.companyEmail?.value,
          },
        };
        break;

      case 'placement_cell':
        profileData = {
          placementCellProfileData: {
            name: this.name?.value,
            domains: this.domains?.value,
            branchName: this.branchName?.value,
            degreeNames: this.degreeNames?.value,
            placementCellEmail: this.placementCellEmail?.value,
            website: this.website?.value,
          },
        };
        break;
    }

    const finalPayload = {
      ...userData,
      ...profileData,
    };

    this.registerService.submitRegistrationData(finalPayload).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.successfulRegister.set(true);
      },
      error: (errors: Record<string, string>) => {
        console.log('Registration errors:', errors);
        for (const key in errors) {
          if (!errors.hasOwnProperty(key)) continue;
          const message = errors[key];
          console.log({ key });
          this.mapErrorToControl(key, message);
          console.log('email not found');
        }
      },
    });
  }

  private mapErrorToControl(key: string, message: string) {
    let ctrl = this.userForm.get(key);
    if (ctrl) {
      if (key === 'email') {
        this.step.set(2); // Ensure the step is set to 2 for email errors
        this.userForm.setErrors({ invalidForm: true });
        this.emailError.set(message);
      }

      console.log('Setting error for control:', key, 'with message:', message);
      ctrl.setErrors({ server: message });
      ctrl.markAsTouched();
      ctrl.markAsDirty();
      console.log('Control state after setting error:', {
        errors: ctrl.errors,
        touched: ctrl.touched,
        dirty: ctrl.dirty,
        invalid: ctrl.invalid,
      });
      return;
    }

    ctrl = this.profileForm.get(key);
    if (ctrl) {
      ctrl.setErrors({ server: message });
      return;
    }

    const parts = key.split('.');
    if (parts.length === 2) {
      ctrl = this.profileForm.get(parts[1]);
      if (ctrl) {
        ctrl.setErrors({ server: message });
      }
    }
  }

  onNextStep() {
    this.step.update((prevStep) => (prevStep === 3 ? 3 : prevStep + 1));
  }

  onRegisterSuccess() {}

  onLoginRedirect() {}

  onHandleRoleError(serverRoleError: string) {
    this.step.set(1);
    this.roleError.set(serverRoleError);
  }

  onPreviousStep() {
    this.step.update((prevStep) => prevStep - 1 || 1);
  }

  onSelectedPlacementCell(selectedPlacementCellName: string | null) {
    this.placementCellDegrees.set(undefined);
    this.placementCellId?.reset();
    if (selectedPlacementCellName) {
      console.log({ selectedPlacementCellName });
      const placementCell = this.placementCells().find(
        (cell) => cell.name === selectedPlacementCellName
      );
      const degrees = placementCell?.placementCellDegrees;
      this.placementCellDegrees.set(degrees);
      this.degreeId?.reset();
      this.placementCellId?.setValue(placementCell?.placementCellId);
    }
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
  get branchId() {
    return this.profileForm.get('branchId');
  }
  get degreeId() {
    return this.profileForm.get('degreeId');
  }
  get placementCellId() {
    return this.profileForm.get('placementCellId');
  }
  get placementCellSearch() {
    return this.profileForm.get('placementCellSearch');
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
  get placementCellEmail() {
    return this.profileForm.get('placementCellEmail');
  }
  get companyEmail() {
    return this.profileForm.get('companyEmail');
  }
  get enteredDomain() {
    return this.profileForm.get('enteredDomain');
  }

  onDomainAdded(enteredDomain: string | null) {
    if (
      enteredDomain &&
      enteredDomain.trim() &&
      !this.placementCellAddedDomains().includes(enteredDomain)
    ) {
      this.placementCellAddedDomains.update((domains) => [
        ...domains,
        enteredDomain,
      ]);
      this.domains?.setValue([...this.placementCellAddedDomains()]);
    }
  }

  onDegreeSelected(degree: string | null) {
    this.selectedDegree.set(degree);
  }

  onDegreeAdded(degree: string | null) {
    if (degree && !this.placementCellAddedDegrees().includes(degree)) {
      this.placementCellAddedDegrees.update((degrees) => [...degrees, degree]);
      this.degreeNames?.setValue([...this.placementCellAddedDegrees()]);
      this.selectedDegree.set(null);
    }
  }

  removeDomain(domain: string) {
    this.placementCellAddedDomains.update((domains) =>
      domains.filter((d) => d !== domain)
    );
    this.domains?.setValue([...this.placementCellAddedDomains()]);
  }

  removeDegree(degree: string) {
    this.placementCellAddedDegrees.update((degrees) =>
      degrees.filter((d) => d !== degree)
    );
    this.degreeNames?.setValue([...this.placementCellAddedDegrees()]);
  }
}
