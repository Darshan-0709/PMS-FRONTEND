// src/app/features/placement-cell/components/placement-cell-navbar/placement-cell-navbar.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-placement-cell-navbar',
  standalone: true,
  template: `
    <nav
      class="bg-brand-blue-50 shadow px-4 py-3 flex items-center justify-between"
    >
      <div class="flex items-center gap-4">
        <span class="font-bold text-lg text-blue-900">Placement Cell</span>
        <a routerLink="/placement-cell/dashboard" class="nav-link">Dashboard</a>
        <a routerLink="/placement-cell/profile" class="nav-link">Profile</a>
        <a routerLink="/placement-cell/students" class="nav-link">Students</a>
        <a routerLink="/placement-cell/recruiters" class="nav-link"
          >Recruiters</a
        >
      </div>
      <button class="btn btn-sm btn-danger" (click)="logout()">Logout</button>
    </nav>
  `,
  styles: [
    `
      .nav-link {
        @apply text-blue-900 hover:text-brand-blue-700 px-3 py-2 rounded transition;
      }
    `,
  ],
})
export class PlacementCellNavbarComponent {
  logout() {
    localStorage.clear();
    window.location.href = '/auth/login';
  }
}
