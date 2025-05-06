import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../types/role.type';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    console.log('=== AuthGuard Debug ===');
    console.log('Current URL:', state.url);
    console.log('Route Config:', route.routeConfig);
    console.log('Route Data:', route.data);
    console.log('Route Params:', route.params);
    console.log('Route Query Params:', route.queryParams);

    const user = this.authService.user();
    console.log('Current User:', user);
    console.log('User Role:', user?.role);
    console.log('Is Authenticated:', this.authService.isAuthenticated());

    if (!this.authService.isAuthenticated()) {
      console.log('Not authenticated, redirecting to login');
      return this.router.createUrlTree(['/auth/login']);
    }

    if (!user) {
      console.log('No user data, redirecting to login');
      return this.router.createUrlTree(['/auth/login']);
    }

    const url = state.url;
    const rolePath = this.getRolePath(user.role);
    const rolePrefix = this.getRolePrefix(user.role);

    console.log('Role Path:', rolePath);
    console.log('Role Prefix:', rolePrefix);
    console.log('URL starts with role prefix:', url.startsWith(rolePrefix));

    if (url === '/auth/login') {
      console.log('On login page, redirecting to role dashboard');
      return this.router.createUrlTree([rolePath]);
    }

    if (!url.startsWith(rolePrefix)) {
      console.log(
        'URL does not match role prefix, redirecting to role dashboard'
      );
      return this.router.createUrlTree([rolePath]);
    }

    if (url === '/') {
      console.log('On root, redirecting to role dashboard');
      return this.router.createUrlTree([rolePath]);
    }

    console.log('Access granted');
    console.log('=== End AuthGuard Debug ===');
    return true;
  }

  private getRolePath(role: Role): string {
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

  private getRolePrefix(role: Role): string {
    switch (role) {
      case 'student':
        return '/student';
      case 'recruiter':
        return '/recruiter';
      case 'placement_cell':
        return '/placement-cell';
      default:
        return '/auth';
    }
  }
}
