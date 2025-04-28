import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterBaseData } from '../user.mode';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private http: HttpClient) {}

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
}
