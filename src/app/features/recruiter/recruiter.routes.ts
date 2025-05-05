import { Routes } from '@angular/router';

export const RECRUITER_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
  },
  {
    path: 'jobs',
    loadComponent: () =>
      import('./pages/jobs/jobs.component').then((m) => m.JobsComponent),
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];
