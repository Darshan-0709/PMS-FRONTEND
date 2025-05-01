import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const requiredRole = route.data['role'];
  
  if (!requiredRole || authService.hasRole(requiredRole)) {
    return true;
  }
  
  // Redirect based on actual role
  const user = authService.user();
  if (user) {
    switch (user.role) {
      case 'STUDENT':
        router.navigate(['/student']);
        break;
      case 'COMPANY':
        router.navigate(['/company']);
        break;
      case 'PLACEMENT_OFFICER':
        router.navigate(['/placement-officer']);
        break;
      default:
        router.navigate(['/auth/login']);
    }
  } else {
    router.navigate(['/auth/login']);
  }
  
  return false;
};