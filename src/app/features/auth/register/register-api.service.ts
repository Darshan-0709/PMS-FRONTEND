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
          console.error(err.error.errors);
          return throwError(() => err.error.errors);
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
          console.error(err);
          return throwError(() => err);
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
          console.error(err);
          return throwError(() => err);
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
          console.error(err);
          return throwError(() => err);
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
          console.error(err.error.errors);
          return throwError(() => err.error.errors);
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
          console.error(err.error.errors);
          return throwError(() => err.error.errors);
        })
      );
  }
}
