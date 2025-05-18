import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import {
  BatchVerifyStudentsRequest,
  PaginatedStudents,
  Student,
  StudentUpdateRequest,
} from '../types/student.types';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../types/api-response.types';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private api = inject(ApiService);

  getStudent(id: string): Observable<ApiResponse<Student>> {
    return this.api.get<Student>(`students/${id}`);
  }

  getStudents(page: number = 1, pageSize: number = 10): Observable<ApiResponse<PaginatedStudents>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.api.get<PaginatedStudents>('students', params);
  }

  updateStudent(id: string, updateData: StudentUpdateRequest): Observable<ApiResponse<Student>> {
    return this.api.patch<Student>(`students/${id}`, updateData);
  }

  deleteStudent(id: string): Observable<ApiResponse<null>> {
    return this.api.delete<null>(`students/${id}`);
  }

  batchVerifyStudents(
    data: BatchVerifyStudentsRequest
  ): Observable<ApiResponse<{ count: number }>> {
    return this.api.post<{ count: number }>('students/batch-verify', data);
  }
}
