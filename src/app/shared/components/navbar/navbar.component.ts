import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { signal } from '@angular/core';

export interface NavItem {
  label: string;
  path: string;
  icon?: string;
  roles?: string[];
}

// Role-based navigation configuration
export const NAVIGATION_CONFIG: Record<string, NavItem[]> = {
  student: [
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
  ],
  recruiter: [
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
  ],
  placement_cell: [
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
  ],
};

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: [],
})
export class NavbarComponent implements OnInit {
  @Input() brandName: string = 'PMS';
  @Input() navItems: NavItem[] = [];

  user = signal<any>(null);
  navigationConfig = NAVIGATION_CONFIG;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    console.log('=== NavbarComponent Debug ===');
    console.log('Initial navItems:', this.navItems);

    this.user.set(this.authService.user());
    console.log('Current User:', this.user());

    // If no navItems provided, use role-based configuration
    if (!this.navItems.length) {
      const userRole = this.user()?.role?.toLowerCase();
      console.log('User Role:', userRole);

      if (userRole && this.navigationConfig[userRole]) {
        this.navItems = this.navigationConfig[userRole];
        console.log('Setting navItems from config:', this.navItems);
      }
    }
    console.log('=== End NavbarComponent Debug ===');
  }

  get filteredNavItems(): NavItem[] {
    const userRole = this.user()?.role?.toLowerCase();
    console.log('=== Filtering NavItems ===');
    console.log('User Role:', userRole);
    console.log('Available navItems:', this.navItems);

    const filtered = this.navItems.filter(
      (item) =>
        !item.roles ||
        item.roles.map((r) => r.toLowerCase()).includes(userRole || '')
    );
    console.log('Filtered navItems:', filtered);
    console.log('=== End Filtering NavItems ===');
    return filtered;
  }

  logout() {
    this.authService.logout();
  }
}
