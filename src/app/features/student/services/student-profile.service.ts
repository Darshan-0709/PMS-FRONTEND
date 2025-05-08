import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  Observable,
  catchError,
  throwError,
  tap,
  of,
  BehaviorSubject,
  map,
} from 'rxjs';
import {
  StudentApiResponse,
  StudentProfile,
  StudentProfileUpdatePayload,
} from '../models/student.model';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StudentProfileService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private router = inject(Router);

  private studentProfileSubject = new BehaviorSubject<StudentProfile | null>(
    null
  );
  public studentProfile$ = this.studentProfileSubject.asObservable();

  private isEditModeSubject = new BehaviorSubject<boolean>(false);
  public isEditMode$ = this.isEditModeSubject.asObservable();

  private isPlacementCellViewSubject = new BehaviorSubject<boolean>(false);
  public isPlacementCellView$ = this.isPlacementCellViewSubject.asObservable();

  getStudentProfile(studentId: string): Observable<StudentProfile> {
    return this.http
      .get<StudentApiResponse>(`${this.apiUrl}/students/${studentId}`)
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.studentProfileSubject.next(response.data);
          }
        }),
        catchError(this.handleError),
        map((response) => {
          if (!response.data) {
            throw new Error('Profile data not found');
          }
          return response.data;
        })
      );
  }

  updateStudentProfile(
    studentId: string,
    payload: StudentProfileUpdatePayload
  ): Observable<StudentProfile> {
    console.log('Updating student profile:', payload);

    return this.http
      .patch<StudentApiResponse>(
        `${this.apiUrl}/students/${studentId}`,
        payload
      )
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            // Update the local subject with the updated profile
            this.studentProfileSubject.next(response.data);
          }
        }),
        catchError(this.handleError),
        map((response) => {
          if (!response.data) {
            throw new Error('Updated profile data not found');
          }
          return response.data;
        })
      );
  }

  resetProfile(): void {
    // Reset form to original values without saving
    const currentProfile = this.studentProfileSubject.getValue();
    if (currentProfile) {
      // Create a deep copy to ensure no references are shared
      const profileCopy = JSON.parse(JSON.stringify(currentProfile));
      // Re-emit the current profile to reset the form
      this.studentProfileSubject.next(profileCopy);
    }
    this.setEditMode(false);
  }

  setEditMode(isEdit: boolean): void {
    this.isEditModeSubject.next(isEdit);
  }

  setPlacementCellView(isPlacementCellView: boolean): void {
    this.isPlacementCellViewSubject.next(isPlacementCellView);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    console.error('API Error:', errorMessage);

    // Redirect to forbidden page if unauthorized or forbidden
    if (error.status === 401 || error.status === 403) {
      this.router.navigate(['/forbidden']);
    }

    return throwError(() => new Error(errorMessage));
  }
}
