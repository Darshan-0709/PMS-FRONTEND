import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RegisterAPIService } from './register-api.service';
import {
  UserFormModel,
  RecruiterProfileFormModel,
  PlacementCellProfileFormModel,
  RegisterBaseData,
  FinalRegistrationPayload,
  RecruiterProfileData,
  PlacementCellProfileData,
  StudentProfileData,
} from './register.models';
import { Observable, map, tap, catchError, throwError } from 'rxjs';
import { Branch, Degree, PlacementCellApiData } from '../user.mode';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private http: HttpClient, private fb: FormBuilder) {}

  private api = inject(RegisterAPIService);

  // State signals
  private _currentStep = signal(3);
  private _selectedRole = signal<'student' | 'placement_cell' | 'recruiter'>(
    'student'
  );
  private _userFormData = signal<UserFormModel | null>(null);
  private _profileFormData = signal<
    RecruiterProfileFormModel | PlacementCellProfileFormModel | null
  >(null);
  private _errors = signal<Record<string, string>>({});

  // Computed signals
  currentStep = computed(() => this._currentStep());
  selectedRole = computed(() => this._selectedRole());
  userFormData = computed(() => this._userFormData());
  profileFormData = computed(() => this._profileFormData());
  errors = computed(() => this._errors());

  // API data
  placementCells = signal<PlacementCellApiData[]>([]);
  branches = signal<Branch[]>([]);
  degrees = signal<Degree[]>([]);

  // Step management
  nextStep() {
    this._currentStep.update((step) => Math.min(step + 1, 3));
  }

  previousStep() {
    this._currentStep.update((step) => Math.max(step - 1, 1));
  }

  fetchData() {
    console.log('Fetching');
    this.api
      .fetchPlacementCellDepartment()
      .pipe()
      .subscribe({
        next: (data) => {
          if (data) {
            this.placementCells.set(data);
          }
        },
      });
    this.api
      .fetchBranches()
      .pipe()
      .subscribe({
        next: (data) => {
          if (data) {
            this.branches.set(data);
          }
        },
      });
    this.api
      .fetchDegrees()
      .pipe()
      .subscribe({
        next: (data) => {
          if (data) {
            this.degrees.set(data);
          }
        },
      });
    console.log(this.branches());
  }

  setStep(step: number) {
    this._currentStep.set(Math.max(1, Math.min(step, 3)));
  }

  // Role management
  setRole(role: 'student' | 'placement_cell' | 'recruiter') {
    this._selectedRole.set(role);
  }

  // Form data management
  setUserFormData(data: UserFormModel) {
    this._userFormData.set(data);
  }

  setProfileFormData(
    data: RecruiterProfileFormModel | PlacementCellProfileFormModel
  ) {
    this._profileFormData.set(data);
  }

  // Error management
  setErrors(errors: Record<string, string>) {
    this._errors.set(errors);
  }

  clearErrors() {
    this._errors.set({});
  }

  // Validation and submission
  validateUserData(userData: UserFormModel): Observable<boolean> {
    const payload: RegisterBaseData = {
      ...userData,
      role: this.selectedRole(),
    };

    return this.api.validateUserData(payload).pipe(
      tap(() => {
        this.setUserFormData(userData);
        this.clearErrors();
      }),
      map(() => true),
      catchError((error) => {
        if (error.error?.errors) {
          this.setErrors(error.error.errors);
        }
        return throwError(() => error);
      })
    );
  }

  submitRegistration(): Observable<any> {
    if (!this.userFormData() || !this.profileFormData()) {
      throw new Error('Form data is incomplete');
    }

    const baseData: RegisterBaseData = {
      email: this.userFormData()!.email,
      username: this.userFormData()!.username,
      password: this.userFormData()!.password,
      confirmPassword: this.userFormData()!.confirmPassword,
      role: this.selectedRole(),
    };

    let payload: FinalRegistrationPayload;

    switch (this.selectedRole()) {
      case 'recruiter':
        payload = {
          ...baseData,
          role: 'recruiter',
          recruiterProfileData:
            this.profileFormData() as unknown as RecruiterProfileData,
        };
        break;
      case 'placement_cell':
        payload = {
          ...baseData,
          role: 'placement_cell',
          placementCellProfileData:
            this.profileFormData() as unknown as PlacementCellProfileData,
        };
        break;
      case 'student':
        payload = {
          ...baseData,
          role: 'student',
          studentProfileData:
            this.profileFormData() as unknown as StudentProfileData,
        };
        break;
      default:
        throw new Error('Invalid role selected');
    }

    return this.api.submitRegistrationData(payload).pipe(
      tap(() => this.clearErrors()),
      catchError((error) => {
        if (error.error?.errors) {
          this.setErrors(error.error.errors);
        }
        return throwError(() => error);
      })
    );
  }
}
