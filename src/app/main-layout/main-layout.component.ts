import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NAVIGATION_CONFIG } from '../navigation.config';
import { AuthService } from '../services/auth.service';
import { SidebarComponent } from '../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'],
})
export class MainLayoutComponent implements OnInit {
  currentPath: string = '';
  userRole = computed(() => this.authService.currentUser()?.role || null);

  // Navigation items from config
  studentNavItems = NAVIGATION_CONFIG['student'];
  recruiterNavItems = NAVIGATION_CONFIG['recruiter'];
  placementCellNavItems = NAVIGATION_CONFIG['placement_cell'];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Get initial path
    this.currentPath = this.router.url;

    // Subscribe to route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentPath = event.url;
      });
  }
}
