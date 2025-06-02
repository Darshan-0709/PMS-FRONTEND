import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ToastService } from './toast.service';
import { ApiResponse } from '../types/api-response.types';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  private baseUrl = environment.apiUrl;

  get<T>(endpoint: string, params?: HttpParams): Observable<ApiResponse<T>> {
    return this.http
      .get<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, { params })
      .pipe(catchError(error => this.handleError(error)));
  }

  post<T, U = T>(endpoint: string, body: U): Observable<ApiResponse<T>> {
    return this.http
      .post<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, body)
      .pipe(catchError(error => this.handleError(error)));
  }

  put<T, U = T>(endpoint: string, body: U): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, body).pipe(
      catchError(error => {
        return this.handleError(error);
      })
    );
  }

  delete<T>(endpoint: string): Observable<ApiResponse<T>> {
    return this.http
      .delete<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`)
      .pipe(catchError(error => this.handleError(error)));
  }

  private handleError(err: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    this.toastService.show(errorMessage, 'error');
    if (err.error && err.error.message) {
      errorMessage = err.error.message;
      if (err.error.errors && Object.keys(err.error.errors).length != 0) {
        this.toastService.show(errorMessage, 'error');
      }
    } else {
      this.toastService.show(errorMessage, 'error');
    }

    return throwError(() => err);
  }
}
