import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { API_CONFIG, ApiResponse } from '../config/api.config';
import { AuthUser, AuthResponse } from '../../shared/types/auth.types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  role: AuthUser['role'];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly AUTH_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';

  public user = signal<AuthUser | null>(null);
  private authState = signal<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {
    this.loadStoredAuth();
  }

  private loadStoredAuth() {
    const token = localStorage.getItem(this.AUTH_KEY);
    const userData = localStorage.getItem(this.USER_KEY);

    console.log('AuthService: Checking localStorage for user and token');
    console.log('AuthService: token from localStorage:', token);
    console.log('AuthService: userData from localStorage:', userData);

    if (token && userData) {
      console.log(
        'AuthService: Found valid token and userData, setting signals'
      );
      this.user.set(JSON.parse(userData));
      this.authState.set(true);
    } else {
      console.log('AuthService: No valid token/userData found');
    }
  }

  login(credentials: LoginCredentials): Observable<ApiResponse<AuthResponse>> {
    return this.http
      .post<ApiResponse<AuthResponse>>(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.login}`,
        credentials
      )
      .pipe(
        tap((response) => {
          if (response.success && response.data) {
            this.setAuth(response.data.user, response.data.token);
          }
        })
      );
  }

  register(
    credentials: RegisterCredentials
  ): Observable<ApiResponse<{ user: AuthUser }>> {
    return this.http.post<ApiResponse<{ user: AuthUser }>>(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.register}`,
      credentials
    );
  }

  private setAuth(user: AuthUser, token: string) {
    localStorage.setItem(this.AUTH_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.user.set(user);
    this.authState.set(true);
  }

  logout() {
    localStorage.removeItem(this.AUTH_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.user.set(null);
    this.authState.set(false);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.AUTH_KEY);
  }

  isAuthenticated(): boolean {
    return this.authState();
  }

  redirectBasedOnRole() {
    const currentUser = this.user();
    if (!currentUser) return;

    switch (currentUser.role) {
      case 'student':
        this.router.navigate(['/student/dashboard']);
        break;
      case 'recruiter':
        this.router.navigate(['/recruiter/dashboard']);
        break;
      case 'placement_cell':
        this.router.navigate(['/placement-cell/dashboard']);
        break;
    }
  }
}
