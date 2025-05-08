import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(private router: Router, private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Get the auth token from the service
    const authToken = this.authService.getToken();

    // Clone the request and add headers
    const modifiedRequest = request.clone({
      url: this.ensureApiUrl(request.url),
      setHeaders: {
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        'Content-Type': 'application/json',
      },
    });

    return next.handle(modifiedRequest).pipe(
      retry(1),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Unauthorized - redirect to login
          this.authService.logout();
          this.router.navigate(['/auth/login']);
        } else if (error.status === 403) {
          // Forbidden - redirect to forbidden page
          this.router.navigate(['/forbidden']);
        }

        return throwError(() => error);
      })
    );
  }

  private ensureApiUrl(url: string): string {
    // If the URL already starts with http(s), don't modify it
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    // If not prefixed with the API URL and not starting with a slash, add a slash
    if (!url.startsWith('/')) {
      url = '/' + url;
    }

    // Append to API URL
    return `${environment.apiUrl}${url}`;
  }
}
