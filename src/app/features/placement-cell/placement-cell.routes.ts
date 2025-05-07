import { Routes } from '@angular/router';
import { MainLayoutComponent } from '../../shared/layouts/main-layout/main-layout.component';
import { ProfileComponent } from './pages/profile/profile.component';
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
        component: ProfileComponent,
        title: 'Placement Cell Profile'
      },
      {
        path: 'students',
        loadComponent: () =>
          import('./pages/students/students.component').then(
            (m) => m.StudentsComponent
          ),
      },
      {
        path: 'recruiters',
        loadComponent: () =>
          import('./pages/recruiters/recruiters.component').then(
            (m) => m.RecruitersComponent
          ),
      },
      {
        path: 'students/:id',
        component: StudentDetailsComponent,
        title: 'Student Details'
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
