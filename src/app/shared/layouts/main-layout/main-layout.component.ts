import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { NAVIGATION_CONFIG } from '../../config/navigation.config';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  template: `
    @switch (userRole()) { @case ('student') {
    <app-sidebar brandName="Student Portal" [navItems]="studentNavItems">
      <router-outlet />
    </app-sidebar>
    } @case ('recruiter') {
    <app-sidebar brandName="Recruiter Portal" [navItems]="recruiterNavItems">
      <router-outlet />
    </app-sidebar>
    } @case ('placement_cell') {
    <app-sidebar brandName="Placement Cell" [navItems]="placementCellNavItems">
      <router-outlet />
    </app-sidebar>
    } @default {
    <!-- Fallback navigation based on URL path if role is not available -->
    @if (currentPath.startsWith('/student/')) {
    <app-sidebar brandName="Student Portal" [navItems]="studentNavItems">
      <router-outlet />
    </app-sidebar>
    } @else if (currentPath.startsWith('/recruiter/')) {
    <app-sidebar brandName="Recruiter Portal" [navItems]="recruiterNavItems">
      <router-outlet />
    </app-sidebar>
    } @else if (currentPath.startsWith('/placement-cell/')) {
    <app-sidebar brandName="Placement Cell" [navItems]="placementCellNavItems">
      <router-outlet />
    </app-sidebar>
    } } }
  `,
  styleUrls: ['./main-layout.component.css'],
})
export class MainLayoutComponent implements OnInit {
  currentPath: string = '';
  userRole = computed(() => this.authService.user()?.role || null);

  // Navigation items from config
  studentNavItems = NAVIGATION_CONFIG['student'];
  recruiterNavItems = NAVIGATION_CONFIG['recruiter'];
  placementCellNavItems = NAVIGATION_CONFIG['placement_cell'];

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    // Get initial path
    this.currentPath = this.router.url;
    console.log('MainLayout: Initial path:', this.currentPath);
    console.log('MainLayout: User role:', this.userRole());

    // Subscribe to route changes
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentPath = event.url;
        console.log('MainLayout: Path changed to:', this.currentPath);
        console.log('MainLayout: Current user role:', this.userRole());
      });
  }
}
