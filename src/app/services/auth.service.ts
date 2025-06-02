import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from './api.service';
import { AuthResponse, AuthUser, LoginRequest, RegisterRequest } from '../types/auth.types';
import { Observable, tap } from 'rxjs';
import { ApiResponse } from '../types/api-response.types';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = inject(ApiService);
  private router = inject(Router);
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  currentUser = signal<AuthUser | null>(this.loadUser());
  isLoggedIn = signal<boolean>(!!this.loadToken());

  login(loginData: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.api.post<AuthResponse, LoginRequest>('auth/login', loginData).pipe(
      tap(response => {
        if (response.success) {
          this.saveToken(response.data.token);
          this.saveUser(response.data.user);
          this.currentUser.set(response.data.user);
          this.isLoggedIn.set(true);
        }
      })
    );
  }

  register(registerData: RegisterRequest): Observable<ApiResponse<AuthUser>> {
    return this.api.post<AuthUser, RegisterRequest>('auth/register', registerData);
  }

  validateUserInput(userData: RegisterRequest): Observable<ApiResponse<any>> {
    return this.api.post<any>('auth/validate-user', userData);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return this.loadToken();
  }

  redirectBasedOnRole(): void {
    const user = this.currentUser();
    if (!user) {
      this.router.navigate(['/auth/login']);
      return;
    }

    switch (user.role) {
      case 'student':
        this.router.navigate(['/student/dashboard']);
        break;
      case 'placement_cell':
        this.router.navigate(['/placement-cell/dashboard']);
        break;
      case 'recruiter':
        this.router.navigate(['/recruiter/dashboard']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }

  private saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private loadToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private saveUser(user: AuthUser): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private loadUser(): AuthUser | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }
}
