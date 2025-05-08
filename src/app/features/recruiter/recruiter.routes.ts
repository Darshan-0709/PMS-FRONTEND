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
        title: 'Recruiter Profile',
      },
      {
        path: 'jobs',
        loadComponent: () =>
          import('./pages/jobs/jobs.component').then((m) => m.JobsComponent),
        title: 'Job Postings',
      },
      {
        path: 'criteria',
        loadComponent: () =>
          import('./pages/criteria/criteria.component').then(
            (m) => m.CriteriaComponent
          ),
        title: 'Eligibility Criteria',
      },
      {
        path: 'target-colleges',
        loadComponent: () =>
          import('./pages/target-colleges/target-colleges.component').then(
            (m) => m.TargetCollegesComponent
          ),
        title: 'Target Colleges',
      },
      {
        path: 'drives',
        loadComponent: () =>
          import('./pages/drives/drives.component').then(
            (m) => m.DrivesComponent
          ),
        title: 'Drive Schedule',
      },
      {
        path: 'selection',
        loadComponent: () =>
          import('./pages/selection/selection.component').then(
            (m) => m.SelectionComponent
          ),
        title: 'Selection Process',
      },
      {
        path: 'applications',
        loadComponent: () =>
          import('./pages/applications/applications.component').then(
            (m) => m.ApplicationsComponent
          ),
        title: 'Applications',
      },
      {
        path: 'results',
        loadComponent: () =>
          import('./pages/results/results.component').then(
            (m) => m.ResultsComponent
          ),
        title: 'Results & Offers',
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
