import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { StudentNavigationComponent } from '../../../features/student/components/navigation/student-navigation.component';
import { RecruiterNavigationComponent } from '../../../features/recruiter/components/navigation/recruiter-navigation.component';
import { PlacementCellNavigationComponent } from '../../../features/placement-cell/components/navigation/placement-cell-navigation.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    StudentNavigationComponent,
    RecruiterNavigationComponent,
    PlacementCellNavigationComponent,
  ],
  template: `
    @switch (userRole()) { @case ('student') {
    <app-student-navigation>
      <router-outlet />
    </app-student-navigation>
    } @case ('recruiter') {
    <app-recruiter-navigation>
      <router-outlet />
    </app-recruiter-navigation>
    } @case ('placement_cell') {
    <app-placement-cell-navigation>
      <router-outlet />
    </app-placement-cell-navigation>
    } @default {
    <!-- Fallback navigation based on URL path if role is not available -->
    @if (currentPath.startsWith('/student/')) {
    <app-student-navigation>
      <router-outlet />
    </app-student-navigation>
    } @else if (currentPath.startsWith('/recruiter/')) {
    <app-recruiter-navigation>
      <router-outlet />
    </app-recruiter-navigation>
    } @else if (currentPath.startsWith('/placement-cell/')) {
    <app-placement-cell-navigation>
      <router-outlet />
    </app-placement-cell-navigation>
    } } }
  `,
})
export class MainLayoutComponent implements OnInit {
  currentPath: string = '';
  userRole = computed(() => this.authService.user()?.role || null);

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
