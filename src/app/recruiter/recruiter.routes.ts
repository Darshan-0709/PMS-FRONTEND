import { Routes } from '@angular/router';

export const RECRUITER_ROUTES: Routes = [
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
        title: 'Recruiter Profile',
      },
      {
        path: 'jobs',
        loadComponent: () => import('./jobs/jobs.component').then(m => m.JobsComponent),
        title: 'Job Postings',
      },
      {
        path: 'criteria',
        loadComponent: () => import('./criteria/criteria.component').then(m => m.CriteriaComponent),
        title: 'Eligibility Criteria',
      },
      {
        path: 'target-colleges',
        loadComponent: () =>
          import('./target-colleges/target-colleges.component').then(
            m => m.TargetCollegesComponent
          ),
        title: 'Target Colleges',
      },
      {
        path: 'drives',
        loadComponent: () => import('./drives/drives.component').then(m => m.DrivesComponent),
        title: 'Drive Schedule',
      },
      {
        path: 'selection',
        loadComponent: () =>
          import('./selection/selection.component').then(m => m.SelectionComponent),
        title: 'Selection Process',
      },
      {
        path: 'applications',
        loadComponent: () =>
          import('./applications/applications.component').then(m => m.ApplicationsComponent),
        title: 'Applications',
      },
      {
        path: 'results',
        loadComponent: () => import('./results/results.component').then(m => m.ResultsComponent),
        title: 'Results & Offers',
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
