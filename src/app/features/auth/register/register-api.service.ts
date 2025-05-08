import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import {
  RegisterBaseData,
  Branch,
  Degree,
  PlacementCellApiData,
  RegisterInput,
} from './register.models';
import { ApiResponse } from '../../../models/api-response.model';
import { API_CONFIG } from '../../../core/config/api.config';

@Injectable({
  providedIn: 'root',
})
export class RegisterAPIService {
  constructor(private http: HttpClient) {}

  validateUserData(userData: RegisterBaseData) {
    return this.http
      .post<ApiResponse<any>>(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.validateUser}`,
        userData
      )
      .pipe(
        catchError((err) => {
          console.error(
            'API Error - validateUserData:',
            err.error?.errors || err
          );
          // Return just the errors object for consistent error handling
          return throwError(
            () => err.error?.errors || { general: 'Unknown error occurred' }
          );
        })
      );
  }

  fetchBranches() {
    return this.http
      .get<ApiResponse<Branch[]>>(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.branches}`
      )
      .pipe(
        map((data) => data.data),
        catchError((err) => {
          console.error('API Error - fetchBranches:', err);
          return throwError(
            () => err.error?.errors || { general: 'Failed to fetch branches' }
          );
        })
      );
  }

  fetchDegrees() {
    return this.http
      .get<ApiResponse<Degree[]>>(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.degrees}`
      )
      .pipe(
        map((data) => data.data),
        catchError((err) => {
          console.error('API Error - fetchDegrees:', err);
          return throwError(
            () => err.error?.errors || { general: 'Failed to fetch degrees' }
          );
        })
      );
  }

  fetchPlacementCellDepartment() {
    return this.http
      .get<ApiResponse<PlacementCellApiData[]>>(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.placementCell.list}`
      )
      .pipe(
        map((data) => data.data),
        catchError((err) => {
          console.error('API Error - fetchPlacementCellDepartment:', err);
          return throwError(
            () =>
              err.error?.errors || {
                general: 'Failed to fetch placement cells',
              }
          );
        })
      );
  }

  submitRegistrationData(payload: RegisterInput) {
    return this.http
      .post<ApiResponse<any>>(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.register}`,
        payload
      )
      .pipe(
        catchError((err) => {
          console.error(
            'API Error - submitRegistrationData:',
            err.error?.errors || err
          );
          return throwError(
            () => err.error?.errors || { general: 'Registration failed' }
          );
        })
      );
  }

  submitRegistration(userData: RegisterBaseData) {
    return this.http
      .post<ApiResponse<any>>(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.register}`,
        userData
      )
      .pipe(
        catchError((err) => {
          console.error(
            'API Error - submitRegistration:',
            err.error?.errors || err
          );
          return throwError(
            () => err.error?.errors || { general: 'Registration failed' }
          );
        })
      );
  }
}
