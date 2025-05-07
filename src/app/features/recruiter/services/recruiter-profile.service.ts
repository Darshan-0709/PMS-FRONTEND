import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  Observable,
  catchError,
  throwError,
  tap,
  BehaviorSubject,
  map,
} from 'rxjs';
import {
  RecruiterApiResponse,
  RecruiterProfile,
  RecruiterUpdatePayload,
} from '../models/recruiter.model';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RecruiterProfileService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private router = inject(Router);

  private profileSubject = new BehaviorSubject<RecruiterProfile | null>(null);
  public profile$ = this.profileSubject.asObservable();

  private isEditModeSubject = new BehaviorSubject<boolean>(false);
  public isEditMode$ = this.isEditModeSubject.asObservable();

  getProfile(recruiterId: string): Observable<RecruiterProfile> {
    return this.http
      .get<RecruiterApiResponse>(`${this.apiUrl}/recruiters/${recruiterId}`)
      .pipe(
        tap((response) => {
          if (response.success) {
            this.profileSubject.next(response.data);
          }
        }),
        catchError(this.handleError),
        // Map the API response to RecruiterProfile
        map((response) => response.data as RecruiterProfile)
      );
  }

  updateProfile(
    recruiterId: string,
    data: RecruiterUpdatePayload
  ): Observable<RecruiterProfile> {
    return this.http
      .patch<RecruiterApiResponse>(
        `${this.apiUrl}/recruiters/${recruiterId}`,
        data
      )
      .pipe(
        tap((response) => {
          if (response.success) {
            this.profileSubject.next(response.data);
            this.setEditMode(false);
          }
        }),
        catchError(this.handleError),
        // Map the API response to RecruiterProfile
        map((response) => response.data as RecruiterProfile)
      );
  }

  setEditMode(isEdit: boolean): void {
    this.isEditModeSubject.next(isEdit);
  }

  resetProfile(): void {
    // Reset to the last saved profile (useful for cancel operations)
    const currentProfile = this.profileSubject.getValue();
    if (currentProfile) {
      this.profileSubject.next({ ...currentProfile });
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
