import { inject, Injectable, signal } from '@angular/core';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { CommonService } from './common.service';
import { ToastService } from './toast.service';

import { Branch, Degree, PlacementCellListItem } from '../types/common.types';
import { ApiResponse } from '../types/api-response.types';
import {
  BaseRegisterRequest,
  PlacementCellProfileData,
  RecruiterProfileData,
  RegisterRequest,
  StudentProfileData,
} from '../types/auth.types';

/**
 * Service for managing the registration flow
 * Handles the multi-step form state and communication with backend
 */
@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private api = inject(ApiService);
  private authService = inject(AuthService);
  private commonService = inject(CommonService);
  private toastService = inject(ToastService);

  // State signals
  currentStep = signal(1);
  selectedRole = signal<'student' | 'placement_cell' | 'recruiter'>('student');
  userFormData = signal<BaseRegisterRequest | null>(null);
  studentProfile = signal<StudentProfileData | null>(null);
  recruiterProfile = signal<RecruiterProfileData | null>(null);
  placementCellProfile = signal<PlacementCellProfileData | null>(null);
  errors = signal<Record<string, string>>({});

  // API data
  placementCells = signal<PlacementCellListItem[]>([]); // Will be typed properly when building the API
  branches = signal<Branch[]>([]);
  degrees = signal<Degree[]>([]);

  // Step management
  nextStep() {
    this.currentStep.update(step => Math.min(step + 1, 3));
  }

  previousStep() {
    this.currentStep.update(step => Math.max(step - 1, 1));
  }

  setStep(step: number) {
    this.currentStep.set(Math.max(1, Math.min(step, 3)));
  }

  // Role management
  setRole(role: 'student' | 'placement_cell' | 'recruiter') {
    this.selectedRole.set(role);
  }

  // Form data management
  setUserFormData(data: BaseRegisterRequest) {
    this.userFormData.set(data);
  }

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

  // Error management
  setErrors(errors: Record<string, string>) {
    this.errors.set(errors);
  }

  clearErrors() {
    this.errors.set({});
  }

  // Method to clear all form data on component destruction
  clearAllData() {
    this.userFormData.set(null);
    this.studentProfile.set(null);
    this.recruiterProfile.set(null);
    this.placementCellProfile.set(null);
    this.currentStep.set(1);
    this.selectedRole.set('student');
    this.clearErrors();
  }

  // Fetch all required data for registration forms
  fetchData() {
    // Fetch degrees
    this.commonService.getDegrees().subscribe({
      next: response => {
        if (response.success) {
          this.degrees.set(response.data);
        }
      },
      error: error => {
        this.toastService.show('Failed to load degrees', 'error');
      },
    });

    // Fetch branches
    this.commonService.getBranches().subscribe({
      next: response => {
        if (response.success) {
          this.branches.set(response.data);
        }
      },
      error: error => {
        this.toastService.show('Failed to load branches', 'error');
      },
    });

    // Fetch placement cells
    this.getPlacementCells().subscribe({
      next: data => {
        this.placementCells.set(data);
      },
      error: error => {
        this.toastService.show('Failed to load placement cells', 'error');
      },
    });
  }

  // Helper method to get placement cells
  private getPlacementCells(): Observable<PlacementCellListItem[]> {
    return this.api
      .get<PlacementCellListItem[]>('placement_cells_list')
      .pipe(map(response => response.data));
  }

  // Check if student email domain is allowed for placement cell
  isStudentEmailDomainAllowed(email: string, placementCellId: string): boolean {
    if (!email || !placementCellId) return false;

    const emailDomain = email.split('@')[1];
    if (!emailDomain) return false;

    const selectedCell = this.placementCells().find(
      cell => cell.placementCellId === placementCellId
    );

    if (!selectedCell) return false;

    return (
      selectedCell.placementCellDomains?.some((domain: string) => {
        // The placementCellDomains array contains domains without @ prefix
        return domain.includes(emailDomain);
      }) ?? false
    );
  }

  // Validate user data before proceeding to next step
  validateUserData(userData: BaseRegisterRequest): Observable<boolean> {
    const payload = {
      ...userData,
      role: this.selectedRole(),
    };

    // For student role, check local validation before sending to server
    if (this.selectedRole() === 'student') {
      const studentProfileData = this.studentProfile();
      if (studentProfileData?.placementCellId) {
        const isEmailValid = this.isStudentEmailDomainAllowed(
          userData.email,
          studentProfileData.placementCellId
        );

        if (!isEmailValid) {
          console.warn("Student's email domain is not allowed for this placement cell");
        }
      }
    }

    return this.authService.validateUserInput(payload as any).pipe(
      tap(() => {
        this.setUserFormData(userData);
        this.clearErrors();
      }),
      map(() => true),
      catchError(error => {
        if (error.error?.errors) {
          this.setErrors(error.error.errors);
        } else {
          this.setErrors({ general: 'Validation failed' });
        }
        return throwError(() => error);
      })
    );
  }

  // Submit the complete registration data
  submitRegistration(): Observable<ApiResponse<any>> {
    if (!this.userFormData()) {
      this.toastService.show('Form data is incomplete', 'error');
      return throwError(() => new Error('Form data is incomplete'));
    }

    const baseData = {
      email: this.userFormData()!.email,
      username: this.userFormData()!.username,
      password: this.userFormData()!.password,
      confirmPassword: this.userFormData()!.confirmPassword,
      role: this.selectedRole(),
    };

    let payload: RegisterRequest;

    switch (this.selectedRole()) {
      case 'student':
        if (!this.studentProfile()) {
          this.toastService.show('Student profile data is incomplete', 'error');
          return throwError(() => new Error('Student profile data is incomplete'));
        }
        payload = {
          ...baseData,
          role: 'student',
          studentProfileData: this.studentProfile()!,
        };
        break;
      case 'recruiter':
        if (!this.recruiterProfile()) {
          this.toastService.show('Recruiter profile data is incomplete', 'error');
          return throwError(() => new Error('Recruiter profile data is incomplete'));
        }
        payload = {
          ...baseData,
          role: 'recruiter',
          recruiterProfileData: this.recruiterProfile()!,
        };
        break;
      case 'placement_cell':
        if (!this.placementCellProfile()) {
          this.toastService.show('Placement cell profile data is incomplete', 'error');
          return throwError(() => new Error('Placement cell profile data is incomplete'));
        }
        payload = {
          ...baseData,
          role: 'placement_cell',
          placementCellProfileData: this.placementCellProfile()!,
        };
        break;
      default:
        this.toastService.show('Invalid role selected', 'error');
        return throwError(() => new Error('Invalid role selected'));
    }

    return this.authService.register(payload).pipe(
      tap(() => this.clearErrors()),
      catchError(error => {
        if (error.error?.errors) {
          this.setErrors(error.error.errors);
        } else {
          this.setErrors({ general: 'Registration failed' });
        }
        return throwError(() => error);
      })
    );
  }

  // Helper method to transform form models to API request
  transformPlacementCellFormToApiData(
    formData: PlacementCellProfileData
  ): PlacementCellProfileData {
    return {
      placementCellName: formData.placementCellName,
      placementCellEmail: formData.placementCellEmail,
      website: formData.website,
      branchId: formData.branchId,
      domains: formData.domains,
      degrees: formData.degrees,
    };
  }
}
