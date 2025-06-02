import { Routes } from '@angular/router';

export const STUDENT_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'profile',
        loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent),
      },
      {
        path: 'jobs',
        loadComponent: () => import('./jobs/jobs.component').then(m => m.JobsComponent),
      },
      {
        path: 'applications',
        loadComponent: () =>
          import('./applications/applications.component').then(m => m.ApplicationsComponent),
      },
      {
        path: 'selection',
        loadComponent: () =>
          import('./selection/selection.component').then(m => m.SelectionComponent),
      },
      {
        path: 'results',
        loadComponent: () => import('./results/results.component').then(m => m.ResultsComponent),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];
