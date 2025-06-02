import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NavItem, NAVIGATION_CONFIG } from '../../../navigation.config';
import { Role } from '../../../types/auth.types';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  @Input() brandName: string = 'PMS';
  @Input() navItems: NavItem[] = [];

  user = signal<any>(null);
  navigationConfig = NAVIGATION_CONFIG;
  isCollapsed = signal<boolean>(false);
  isMobile = signal<boolean>(false);

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Check if device is mobile on init
    this.checkIfMobile();

    // Set up resize listener
    window.addEventListener('resize', () => this.checkIfMobile());

    // Set user from auth service
    this.user.set(this.authService.currentUser());

    // If no navItems provided, use role-based configuration
    if (!this.navItems.length) {
      const userRole = this.user()?.role?.toLowerCase();

      if (userRole && this.navigationConfig[userRole]) {
        this.navItems = this.navigationConfig[userRole];
      }
    }
  }

  ngOnDestroy() {
    // Remove resize listener
    window.removeEventListener('resize', () => this.checkIfMobile());
  }

  get filteredNavItems(): NavItem[] {
    const userRole = this.user()?.role?.toLowerCase();
    return this.navigationConfig[userRole];
  }

  toggleSidebar() {
    this.isCollapsed.update(state => !state);
  }

  checkIfMobile() {
    this.isMobile.set(window.innerWidth < 768);

    // Automatically collapse on mobile
    if (this.isMobile()) {
      this.isCollapsed.set(true);
    }
  }

  logout() {
    this.authService.logout();
  }
}
