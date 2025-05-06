import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavItem } from '../../../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-student-navigation',
  standalone: true,
  imports: [SidebarComponent, RouterModule],
  template: `
    <app-sidebar brandName="Student Portal" [navItems]="navItems">
      <ng-content></ng-content>
    </app-sidebar>
  `,
})
export class StudentNavigationComponent {
  navItems: NavItem[] = [
    {
      label: 'Dashboard',
      path: '/student/dashboard',
      icon: 'fas fa-home',
      roles: ['student'],
    },
    {
      label: 'Profile',
      path: '/student/profile',
      icon: 'fas fa-user',
      roles: ['student'],
    },
    {
      label: 'Jobs',
      path: '/student/jobs',
      icon: 'fas fa-briefcase',
      roles: ['student'],
    },
    {
      label: 'Applications',
      path: '/student/applications',
      icon: 'fas fa-file-alt',
      roles: ['student'],
    },
  ];
}
