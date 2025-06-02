import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './guards/auth.guard';
import { MainLayoutComponent } from './main-layout/main-layout.component';

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
    component: MainLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'student' },
    loadChildren: () => import('./student/student.routes').then(m => m.STUDENT_ROUTES),
  },
  {
    path: 'placement-cell',
    component: MainLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'placement_cell' },
    loadChildren: () =>
      import('./placement-cell/placement-cell.routes').then(m => m.PLACEMENT_CELL_ROUTES),
  },
  {
    path: 'recruiter',
    component: MainLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'recruiter' },
    loadChildren: () => import('./recruiter/recruiter.routes').then(m => m.RECRUITER_ROUTES),
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
