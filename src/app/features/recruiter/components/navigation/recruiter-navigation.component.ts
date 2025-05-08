import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavItem } from '../../../../shared/config/navigation.config';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-recruiter-navigation',
  standalone: true,
  imports: [SidebarComponent, RouterModule],
  template: `
    <app-sidebar brandName="Recruiter Portal" [navItems]="navItems">
      <ng-content></ng-content>
    </app-sidebar>
  `,
})
export class RecruiterNavigationComponent {
  navItems: NavItem[] = [
    {
      label: 'Dashboard',
      path: '/recruiter/dashboard',
      icon: 'fas fa-home',
      roles: ['recruiter'],
    },
    {
      label: 'Profile',
      path: '/recruiter/profile',
      icon: 'fas fa-user',
      roles: ['recruiter'],
    },
    {
      label: 'Post Jobs',
      path: '/recruiter/post-jobs',
      icon: 'fas fa-plus-circle',
      roles: ['recruiter'],
    },
    {
      label: 'Applications',
      path: '/recruiter/applications',
      icon: 'fas fa-file-alt',
      roles: ['recruiter'],
    },
  ];
}
