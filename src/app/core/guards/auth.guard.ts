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
    console.log('AuthGuard: canActivate called');
    console.log(
      'AuthGuard: isAuthenticated:',
      this.authService.isAuthenticated()
    );
    console.log('AuthGuard: user:', this.authService.user());

    if (!this.authService.isAuthenticated()) {
      console.log('AuthGuard: Not authenticated, redirecting to /auth/login');
      return this.router.createUrlTree(['/auth/login']);
    }

    const user = this.authService.user();
    if (!user) {
      console.log('AuthGuard: No user, redirecting to /auth/login');
      return this.router.createUrlTree(['/auth/login']);
    }

    const url = state.url;
    const rolePath = this.getRolePath(user.role);

    if (url === '/auth/login') {
      console.log(
        'AuthGuard: On login page but authenticated, redirecting to',
        rolePath
      );
      return this.router.createUrlTree([rolePath]);
    }

    if (!url.startsWith(rolePath)) {
      console.log(
        'AuthGuard: URL does not match role, redirecting to',
        rolePath
      );
      return this.router.createUrlTree([rolePath]);
    }

    if (url === '/') {
      console.log(
        'AuthGuard: On root, redirecting to role dashboard',
        rolePath
      );
      return this.router.createUrlTree([rolePath]);
    }

    console.log('AuthGuard: Access granted');
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
}
