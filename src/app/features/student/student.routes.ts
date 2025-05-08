import { Routes } from '@angular/router';
import { MainLayoutComponent } from '../../shared/layouts/main-layout/main-layout.component';

export const STUDENT_ROUTES: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
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
        path: 'applications',
        loadComponent: () =>
          import('./pages/applications/applications.component').then(
            (m) => m.ApplicationsComponent
          ),
      },
      {
        path: 'selection',
        loadComponent: () =>
          import('./pages/selection/selection.component').then(
            (m) => m.SelectionComponent
          ),
      },
      {
        path: 'results',
        loadComponent: () =>
          import('./pages/results/results.component').then(
            (m) => m.ResultsComponent
          ),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
