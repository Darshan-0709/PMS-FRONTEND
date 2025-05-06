import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavItem } from '../../../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-placement-cell-navigation',
  standalone: true,
  imports: [SidebarComponent, RouterModule],
  template: `
    <app-sidebar brandName="Placement Cell" [navItems]="navItems">
      <ng-content></ng-content>
    </app-sidebar>
  `,
})
export class PlacementCellNavigationComponent {
  navItems: NavItem[] = [
    {
      label: 'Dashboard',
      path: '/placement-cell/dashboard',
      icon: 'fas fa-home',
      roles: ['placement_cell'],
    },
    {
      label: 'Profile',
      path: '/placement-cell/profile',
      icon: 'fas fa-user',
      roles: ['placement_cell'],
    },
    {
      label: 'Students',
      path: '/placement-cell/students',
      icon: 'fas fa-user-graduate',
      roles: ['placement_cell'],
    },
    {
      label: 'Recruiters',
      path: '/placement-cell/recruiters',
      icon: 'fas fa-building',
      roles: ['placement_cell'],
    },
  ];
}
