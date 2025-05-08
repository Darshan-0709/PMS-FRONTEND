import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'student',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/student/student.routes').then((m) => m.STUDENT_ROUTES),
  },
  {
    path: 'recruiter',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/recruiter/recruiter.routes').then(
        (m) => m.RECRUITER_ROUTES
      ),
  },
  {
    path: 'placement-cell',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/placement-cell/placement-cell.routes').then(
        (m) => m.PLACEMENT_CELL_ROUTES
      ),
  },
  {
    path: 'forbidden',
    loadComponent: () =>
      import('./shared/pages/forbidden/forbidden.component').then(
        (m) => m.ForbiddenComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
