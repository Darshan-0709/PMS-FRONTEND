import { Routes } from '@angular/router';
import { MainLayoutComponent } from '../../shared/layouts/main-layout/main-layout.component';
import { StudentDetailsComponent } from './pages/student-details/student-details.component';

export const PLACEMENT_CELL_ROUTES: Routes = [
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
        title: 'Placement Cell Profile',
      },
      {
        path: 'students',
        loadComponent: () =>
          import('./pages/students/students.component').then(
            (m) => m.StudentsComponent
          ),
        title: 'Student Management',
      },
      {
        path: 'students/:id',
        component: StudentDetailsComponent,
        title: 'Student Details',
      },
      {
        path: 'students/:id/edit',
        loadComponent: () =>
          import(
            '../../../app/features/placement-cell/pages/student-edit/student-edit.component'
          ).then((m) => m.StudentEditComponent),
        title: 'Edit Student Profile',
      },
      {
        path: 'job-requests',
        loadComponent: () =>
          import('./pages/job-requests/job-requests.component').then(
            (m) => m.JobRequestsComponent
          ),
        title: 'Job Requests',
      },
      {
        path: 'drives',
        loadComponent: () =>
          import('./pages/drives/drives.component').then(
            (m) => m.DrivesComponent
          ),
        title: 'Placement Drives',
      },
      {
        path: 'rounds',
        loadComponent: () =>
          import('./pages/rounds/rounds.component').then(
            (m) => m.RoundsComponent
          ),
        title: 'Selection Rounds',
      },
      {
        path: 'applications',
        loadComponent: () =>
          import('./pages/applications/applications.component').then(
            (m) => m.ApplicationsComponent
          ),
        title: 'Student Applications',
      },
      {
        path: 'results',
        loadComponent: () =>
          import('./pages/results/results.component').then(
            (m) => m.ResultsComponent
          ),
        title: 'Placement Results',
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
