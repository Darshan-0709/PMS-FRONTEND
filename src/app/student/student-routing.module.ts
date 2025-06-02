import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from '../main-layout/main-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { JobsComponent } from './jobs/jobs.component';
import { ApplicationsComponent } from './applications/applications.component';
import { STUDENT_ROUTES } from './student.routes';

@NgModule({
  imports: [RouterModule.forChild(STUDENT_ROUTES)],
  exports: [RouterModule],
})
export class StudentRoutingModule {}
