import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { API_CONFIG } from '../../../core/config/api.config';
import {
  Student,
  StudentsResponse,
  StudentUpdatePayload,
  VerifyStudentsPayload,
} from '../models/student.model';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private http = inject(HttpClient);
  private apiUrl = API_CONFIG.baseUrl;

  /**
   * Get all students for the current placement cell with pagination
   */
  getStudents(
    page: number = 1,
    pageSize: number = 10
  ): Observable<StudentsResponse> {
    return this.http
      .get<StudentsResponse>(
        `${this.apiUrl}${API_CONFIG.endpoints.students.list}?page=${page}&pageSize=${pageSize}`
      )
      .pipe(
        catchError((error) => {
          console.error('Error fetching students:', error);
          return throwError(
            () => new Error('Failed to fetch students. Please try again later.')
          );
        })
      );
  }

  /**
   * Get a single student by ID
   */
  getStudentById(
    studentId: string
  ): Observable<{ success: boolean; message: string; data: Student }> {
    return this.http
      .get<{ success: boolean; message: string; data: Student }>(
        `${this.apiUrl}${API_CONFIG.endpoints.students.byId(studentId)}`
      )
      .pipe(
        catchError((error) => {
          console.error('Error fetching student:', error);
          return throwError(
            () =>
              new Error(
                'Failed to fetch student details. Please try again later.'
              )
          );
        })
      );
  }

  /**
   * Update a student's details
   */
  updateStudent(
    studentId: string,
    data: StudentUpdatePayload
  ): Observable<{ success: boolean; message: string; data: Student }> {
    return this.http
      .patch<{ success: boolean; message: string; data: Student }>(
        `${this.apiUrl}${API_CONFIG.endpoints.students.byId(studentId)}`,
        data
      )
      .pipe(
        catchError((error) => {
          console.error('Error updating student:', error);
          return throwError(
            () => new Error('Failed to update student. Please try again later.')
          );
        })
      );
  }

  /**
   * Verify/unverify multiple students at once
   */
  batchVerifyStudents(payload: VerifyStudentsPayload): Observable<{
    success: boolean;
    message: string;
    data: { count: number };
  }> {
    return this.http
      .post<{ success: boolean; message: string; data: { count: number } }>(
        `${this.apiUrl}${API_CONFIG.endpoints.students.verify}`,
        payload
      )
      .pipe(
        catchError((error) => {
          console.error('Error verifying students:', error);
          return throwError(
            () =>
              new Error(
                'Failed to update verification status. Please try again later.'
              )
          );
        })
      );
  }
}
