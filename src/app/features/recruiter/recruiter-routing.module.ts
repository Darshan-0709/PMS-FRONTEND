import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RECRUITER_ROUTES } from './recruiter.routes';

@NgModule({
  imports: [RouterModule.forChild(RECRUITER_ROUTES)],
  exports: [RouterModule],
})
export class RecruiterRoutingModule {}
