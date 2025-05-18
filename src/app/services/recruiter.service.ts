import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Recruiter, RecruiterUpdateRequest } from '../types/recruiter.types';
import { Observable } from 'rxjs';
import { ApiResponse } from '../types/api-response.types';

@Injectable({
  providedIn: 'root',
})
export class RecruiterService {
  private api = inject(ApiService);

  getRecruiter(id: string): Observable<ApiResponse<Recruiter>> {
    return this.api.get<Recruiter>(`recruiters/${id}`);
  }

  updateRecruiter(
    id: string,
    updateData: RecruiterUpdateRequest
  ): Observable<ApiResponse<Recruiter>> {
    return this.api.patch<Recruiter>(`recruiters/${id}`, updateData);
  }

  deleteRecruiter(id: string): Observable<ApiResponse<null>> {
    return this.api.delete<null>(`recruiters/${id}`);
  }
}
