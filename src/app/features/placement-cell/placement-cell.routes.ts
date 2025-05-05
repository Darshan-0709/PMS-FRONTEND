import { Routes } from '@angular/router';
import { PlacementCellLayoutComponent } from './components/placement-cell-layout/placement-cell-layout.component';

export const PLACEMENT_CELL_ROUTES: Routes = [
  {
    path: '',
    component: PlacementCellLayoutComponent,
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
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
