import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const user = this.authService.currentUser();

    if (!this.authService.isLoggedIn()) {
      return this.router.createUrlTree(['/auth/login']);
    }

    if (!user) {
      return this.router.createUrlTree(['/auth/login']);
    }

    const url = state.url;
    const rolePath = this.getRolePath(user.role);
    const rolePrefix = this.getRolePath(user.role);

    if (url === '/auth/login') {
      return this.router.createUrlTree([rolePath]);
    }

    if (!url.startsWith(rolePrefix)) {
      return this.router.createUrlTree([rolePath]);
    }

    if (url === '/') {
      return this.router.createUrlTree([rolePath]);
    }
    return true;
  }

  private getRolePath(role: string): string {
    switch (role) {
      case 'student':
        return '/student/dashboard';
      case 'recruiter':
        return '/recruiter/dashboard';
      case 'placement_cell':
        return '/placement-cell/dashboard';
      default:
        return '/auth/login';
    }
  }
}

// Functional guards compatible with the latest Angular Router
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!authService.isLoggedIn()) {
    router.navigate(['/auth/login']);
    return false;
  }

  return true;
};

// Role-based guard to restrict access based on user role
export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const requiredRole = route.data['role'] as string;

  if (!authService.isLoggedIn()) {
    router.navigate(['/auth/login']);
    return false;
  }

  const user = authService.currentUser();
  if (user && user.role === requiredRole) {
    return true;
  }

  // Redirect to forbidden if user doesn't have the required role
  router.navigate(['/forbidden']);
  return false;
};
