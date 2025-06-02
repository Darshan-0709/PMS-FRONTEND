import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Recruiter, RecruiterUpdatePayload } from '../types/recruiter.types';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ApiResponse } from '../types/api-response.types';

@Injectable({
  providedIn: 'root',
})
export class RecruiterService {
  private api = inject(ApiService);

  getRecruiter(id: string): Observable<Recruiter> {
    return this.api.get<Recruiter>(`recruiters/${id}`).pipe(map(response => response.data));
  }

  // updateRecruiter(
  //   id: string,
  //   updateData: RecruiterUpdatePayload
  // ): Observable<ApiResponse<Recruiter>> {
  //   return this.api.put<Recruiter, RecruiterUpdatePayload>(`recruiters/${id}`, updateData);
  // }

  updateRecruiter(id: string, updateData: RecruiterUpdatePayload): Observable<Recruiter> {
    const response = this.api.put<Recruiter, RecruiterUpdatePayload>(
      `recruiters/${id}`,
      updateData
    );
    const recruiter = response.pipe(
      map(response => response.data),
      catchError(error => {
        if (error.error?.errors) {
          return throwError(() => error.error.errors);
        }
        return throwError(() => error);
      })
    );
    return recruiter;
  }

  deleteRecruiter(id: string): Observable<ApiResponse<null>> {
    return this.api.delete<null>(`recruiters/${id}`);
  }
}
