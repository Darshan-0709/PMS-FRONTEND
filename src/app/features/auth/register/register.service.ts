import { inject, Injectable, signal } from '@angular/core';
import { RegisterAPIService } from './register-api.service';
import {
  UserFormModel,
  RegisterBaseData,
  RecruiterProfileData,
  PlacementCellProfileData,
  StudentProfileData,
  Degree,
  PlacementCellApiData,
  Branch,
  RegisterInput,
} from './register.models';
import { Observable, map, tap, catchError, throwError, of } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private api = inject(RegisterAPIService);

  // State signals
  currentStep = signal(1);
  selectedRole = signal<'student' | 'placement_cell' | 'recruiter'>('student');
  userFormData = signal<UserFormModel | null>(null);
  studentProfile = signal<StudentProfileData | null>(null);
  recruiterProfile = signal<RecruiterProfileData | null>(null);
  placementCellProfile = signal<PlacementCellProfileData | null>(null);
  errors = signal<Record<string, string>>({});

  // Computed signals

  // API data
  placementCells = signal<PlacementCellApiData[]>([]);
  branches = signal<Branch[]>([]);
  degrees = signal<Degree[]>([]);

  // Step management
  nextStep() {
    this.currentStep.update((step) => Math.min(step + 1, 3));
    console.log(this.currentStep());
  }

  previousStep() {
    this.currentStep.update((step) => Math.max(step - 1, 1));
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
  }

  setStep(step: number) {
    this.currentStep.set(Math.max(1, Math.min(step, 3)));
  }

  // Role management
  setRole(role: 'student' | 'placement_cell' | 'recruiter') {
    this.selectedRole.set(role);
  }

  // Form data management
  setUserFormData(data: UserFormModel) {
    this.userFormData.set(data);
  }

  // setUserData(data: UserFormModel) {
  //   this.userFormData.set(data);
  // }

  setStudentProfile(data: StudentProfileData) {
    this.studentProfile.set(data);
  }

  setRecruiterProfile(data: RecruiterProfileData) {
    this.recruiterProfile.set(data);
  }

  setPlacementCellProfile(data: PlacementCellProfileData) {
    this.placementCellProfile.set(data);
  }

  getUserDataEmail(): string | undefined {
    return this.userFormData()?.email;
  }

  // Check if student email domain is allowed for placement cell
  isStudentEmailDomainAllowed(email: string, placementCellId: string): boolean {
    if (!email || !placementCellId) return false;

    const emailDomain = email.split('@')[1];
    if (!emailDomain) return false;

    const selectedCell = this.placementCells().find(
      (cell) => cell.placementCellId === placementCellId
    );

    if (!selectedCell) return false;
    console.log(emailDomain);
    return selectedCell.placementCellDomains.some((domain) => {
      // Remove @ prefix if it exists in the domain
      return domain.endsWith(emailDomain)
      const cleanDomain = domain.startsWith('@') ? domain.substring(1) : domain;
      console.log({domain, cleanDomain});
      return emailDomain === cleanDomain;
    });
  }

  // Error management
  setErrors(errors: Record<string, string>) {
    this.errors.set(errors);
  }

  clearErrors() {
    this.errors.set({});
  }

  validateUserData(userData: UserFormModel): Observable<boolean> {
    const payload: RegisterBaseData = {
      ...userData,
      role: this.selectedRole(),
    };

    // For student role, check local validation before sending to server
    if (this.selectedRole() === 'student') {
      // If student profile already exists with a placement cell selected
      const studentProfileData = this.studentProfile();
      if (studentProfileData?.placementCellId) {
        const isEmailValid = this.isStudentEmailDomainAllowed(
          userData.email,
          studentProfileData.placementCellId
        );

        if (!isEmailValid) {
          return throwError(() => ({
            error: {
              errors: {
                email:
                  "Student's email domain is not allowed for this placement cell.",
              },
            },
          }));
        }
      }
    }

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
    if (!this.userFormData()) {
      throw new Error('Form data is incomplete');
    }

    const baseData: RegisterBaseData = {
      email: this.userFormData()!.email,
      username: this.userFormData()!.username,
      password: this.userFormData()!.password,
      confirmPassword: this.userFormData()!.confirmPassword,
      role: this.selectedRole(),
    };

    let payload: RegisterInput;

    switch (this.selectedRole()) {
      case 'student':
        payload = {
          ...baseData,
          role: 'student',
          studentProfileData: this.studentProfile()!,
        };
        break;
      case 'recruiter':
        payload = {
          ...baseData,
          role: 'recruiter',
          recruiterProfileData: this.recruiterProfile()!,
        };
        break;
      case 'placement_cell':
        payload = {
          ...baseData,
          role: 'placement_cell',
          placementCellProfileData: this.placementCellProfile()!,
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
