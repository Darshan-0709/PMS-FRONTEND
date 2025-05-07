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
  PlacementCellApiResponse,
  PlacementCellProfile,
  PlacementCellUpdatePayload,
} from '../models/placement-cell.model';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PlacementCellProfileService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private router = inject(Router);

  private profileSubject = new BehaviorSubject<PlacementCellProfile | null>(
    null
  );
  public profile$ = this.profileSubject.asObservable();

  private isEditModeSubject = new BehaviorSubject<boolean>(false);
  public isEditMode$ = this.isEditModeSubject.asObservable();

  getProfile(placementCellId: string): Observable<PlacementCellProfile> {
    return this.http
      .get<PlacementCellApiResponse>(
        `${this.apiUrl}/placement_cells/${placementCellId}`
      )
      .pipe(
        tap((response) => {
          if (response.success) {
            this.profileSubject.next(response.data);
          }
        }),
        catchError(this.handleError),
        // Map the API response to PlacementCellProfile
        map((response) => response.data as PlacementCellProfile)
      );
  }

  updateProfile(
    placementCellId: string,
    data: PlacementCellUpdatePayload
  ): Observable<PlacementCellProfile> {
    return this.http
      .patch<PlacementCellApiResponse>(
        `${this.apiUrl}/placement_cells/${placementCellId}`,
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
        // Map the API response to PlacementCellProfile
        map((response) => response.data as PlacementCellProfile)
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
