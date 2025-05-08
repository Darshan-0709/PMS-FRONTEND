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

    const user = this.authService.user();

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


    if (url === '/auth/login') {
      console.log('On login page, redirecting to role dashboard');
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
