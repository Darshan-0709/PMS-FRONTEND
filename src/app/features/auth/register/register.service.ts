import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Branch,
  Degree,
  PlacementCellApiData,
  RegisterBaseData,
} from '../user.mode';
import { catchError, map, throwError } from 'rxjs';
import { ApiResponse } from '../../../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private http: HttpClient) {}

  baseUrl = 'http://localhost:3000/api/v1';

  validateUserData(userData: RegisterBaseData) {
    return this.http
      .post('http://localhost:3000/api/v1/auth/validate-user', userData)
      .pipe(
        catchError((err) => {
          console.error(err.error.errors);
          return throwError(() => err.error.errors);
        })
      );
  }

  fetchBranches() {
    return this.http
      .get<ApiResponse<Branch[]>>(`${this.baseUrl}/branches`)
      .pipe(
        map((data) => data.data),
        catchError((err) => {
          console.error(err.error.errors);
          return throwError(() => err.error.errors);
        })
      );
  }

  fetchDegrees() {
    return this.http.get<ApiResponse<Degree[]>>(`${this.baseUrl}/degrees`).pipe(
      map((data) => data.data),
      catchError((err) => {
        console.error(err.error.errors);
        return throwError(() => err.error.errors);
      })
    );
  }

  fetchPlacementCellByDepartment(branchId: string) {
    let url = `${this.baseUrl}/placement_cells_list?branch=${branchId}`;
    return this.http.get<ApiResponse<PlacementCellApiData[]>>(url).pipe(
      map((data) => data.data),
      catchError((err) => {
        console.error(err.error.errors);
        return throwError(() => err.error.errors);
      })
    );
  }

  submitRegistrationData(payload: any) {
    return this.http.post(`${this.baseUrl}/auth/register`, payload).pipe(
      catchError((err) => {
        console.error(err.error.errors);
        return throwError(() => err.error.errors);
      })
    );
  }
}
