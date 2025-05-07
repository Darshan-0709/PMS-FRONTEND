import { Routes } from '@angular/router';
import { MainLayoutComponent } from '../../shared/layouts/main-layout/main-layout.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const RECRUITER_ROUTES: Routes = [
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
        component: ProfileComponent,
        title: 'Recruiter Profile'
      },
      {
        path: 'post-jobs',
        loadComponent: () =>
          import('./pages/post-jobs/post-jobs.component').then(
            (m) => m.PostJobsComponent
          ),
      },
      {
        path: 'applications',
        loadComponent: () =>
          import('./pages/applications/applications.component').then(
            (m) => m.ApplicationsComponent
          ),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
