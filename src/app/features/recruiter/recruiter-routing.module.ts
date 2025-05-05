import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from '../../shared/layouts/main-layout/main-layout.component';
import { RecruiterNavigationComponent } from './components/navigation/navigation.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { JobsComponent } from './pages/jobs/jobs.component';
import { ApplicantsComponent } from './pages/applicants/applicants.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { title: 'Recruiter Dashboard' },
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: { title: 'Recruiter Profile' },
      },
      {
        path: 'jobs',
        component: JobsComponent,
        data: { title: 'Posted Jobs' },
      },
      {
        path: 'applicants',
        component: ApplicantsComponent,
        data: { title: 'Job Applicants' },
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecruiterRoutingModule {}
