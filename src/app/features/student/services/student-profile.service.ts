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
  StudentProfilePlacementCellUpdatePayload,
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
          if (response.success) {
            this.studentProfileSubject.next(response.data);
          }
        }),
        catchError(this.handleError),
        // Map the API response to StudentProfile
        map((response) => response.data as StudentProfile)
      );
  }

  updateStudentProfile(
    studentId: string,
    data: StudentProfileUpdatePayload | StudentProfilePlacementCellUpdatePayload
  ): Observable<StudentProfile> {
    return this.http
      .patch<StudentApiResponse>(`${this.apiUrl}/students/${studentId}`, data)
      .pipe(
        tap((response) => {
          if (response.success) {
            this.studentProfileSubject.next(response.data);
            this.setEditMode(false);
          }
        }),
        catchError(this.handleError),
        // Map the API response to StudentProfile
        map((response) => response.data as StudentProfile)
      );
  }

  setEditMode(isEdit: boolean): void {
    this.isEditModeSubject.next(isEdit);
  }

  setPlacementCellView(isPlacementCellView: boolean): void {
    this.isPlacementCellViewSubject.next(isPlacementCellView);
  }

  resetProfile(): void {
    // Reset to the last saved profile (useful for cancel operations)
    const currentProfile = this.studentProfileSubject.getValue();
    if (currentProfile) {
      this.studentProfileSubject.next({ ...currentProfile });
    }
    this.setEditMode(false);
  }

  private handleError = (error: HttpErrorResponse) => {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      if (error.status === 403) {
        // Redirect to appropriate page for forbidden access
        this.router.navigate(['/forbidden']);
        return throwError(() => new Error('Access forbidden'));
      }

      errorMessage =
        error.error?.message || `Server returned code ${error.status}`;
    }

    return throwError(() => new Error(errorMessage));
  };
}
