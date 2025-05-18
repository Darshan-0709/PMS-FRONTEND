import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './services/auth-guard.service';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent),
      },
    ],
  },
  {
    path: 'student',
    canActivate: [authGuard, roleGuard],
    data: { role: 'student' },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        // This will be implemented later
        loadComponent: () =>
          import('./shared/pages/forbidden/forbidden.component').then(m => m.ForbiddenComponent),
      },
    ],
  },
  {
    path: 'placement-cell',
    canActivate: [authGuard, roleGuard],
    data: { role: 'placement_cell' },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        // This will be implemented later
        loadComponent: () =>
          import('./shared/pages/forbidden/forbidden.component').then(m => m.ForbiddenComponent),
      },
    ],
  },
  {
    path: 'recruiter',
    canActivate: [authGuard, roleGuard],
    data: { role: 'recruiter' },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        // This will be implemented later
        loadComponent: () =>
          import('./shared/pages/forbidden/forbidden.component').then(m => m.ForbiddenComponent),
      },
    ],
  },
  {
    path: 'forbidden',
    loadComponent: () =>
      import('./shared/pages/forbidden/forbidden.component').then(m => m.ForbiddenComponent),
  },
  {
    path: '404',
    loadComponent: () =>
      import('./shared/pages/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
  {
    path: '**',
    redirectTo: '404',
  },
];
