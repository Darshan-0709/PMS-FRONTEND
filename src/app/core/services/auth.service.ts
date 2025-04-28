import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { catchError, Observable, tap, throwError } from 'rxjs';

export interface User {
  id: string;
  email: string;
  role: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  
  // Use signals for reactive state management
  private currentUserSignal = signal<User | null>(null);
  public user = computed(() => this.currentUserSignal());
  
  constructor(
    private http: HttpClient, 
    private router: Router
  ) {
    this.loadUser();
  }
  
  private loadUser() {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken = jwtDecode<{user: User}>(token);
        if (decodedToken && decodedToken.user) {
          this.currentUserSignal.set(decodedToken.user);
        }
      } catch (error) {
        // Invalid token
        this.logout();
      }
    }
  }
  
  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post<{accessToken: string, user: User}>('/api/auth/login', credentials)
      .pipe(
        tap(response => {
          localStorage.setItem(this.TOKEN_KEY, response.accessToken);
          this.currentUserSignal.set(response.user);
        }),
        catchError(error => {
          console.error('Login failed', error);
          return throwError(() => new Error('Invalid credentials'));
        })
      );
  }
  
  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSignal.set(null);
    this.router.navigate(['/auth/login']);
  }
  
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
  
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
  
  hasRole(role: string): boolean {
    const user = this.user();
    return !!user && user.role === role;
  }
  // constructor() { }
}
