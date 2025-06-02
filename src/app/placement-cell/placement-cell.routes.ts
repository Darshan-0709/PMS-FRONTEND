import { Routes } from '@angular/router';

export const PLACEMENT_CELL_ROUTES: Routes = [
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
        title: 'Placement Cell Profile',
      },
      {
        path: 'students',
        loadComponent: () => import('./students/students.component').then(m => m.StudentsComponent),
        title: 'Student Management',
      },
      {
        path: 'students/:id',
        loadComponent: () =>
          import('./student-details/student-details.component').then(
            m => m.StudentDetailsComponent
          ),
        title: 'Student Details',
      },
      {
        path: 'job-requests',
        loadComponent: () =>
          import('./job-requests/job-requests.component').then(m => m.JobRequestsComponent),
        title: 'Job Requests',
      },
      {
        path: 'drives',
        loadComponent: () => import('./drives/drives.component').then(m => m.DrivesComponent),
        title: 'Placement Drives',
      },
      {
        path: 'rounds',
        loadComponent: () => import('./rounds/rounds.component').then(m => m.RoundsComponent),
        title: 'Selection Rounds',
      },
      {
        path: 'applications',
        loadComponent: () =>
          import('./applications/applications.component').then(m => m.ApplicationsComponent),
        title: 'Student Applications',
      },
      {
        path: 'results',
        loadComponent: () => import('./results/results.component').then(m => m.ResultsComponent),
        title: 'Placement Results',
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
