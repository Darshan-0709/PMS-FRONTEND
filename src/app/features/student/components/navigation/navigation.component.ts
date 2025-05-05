import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-student-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="nav">
      <a routerLink="/student/dashboard" routerLinkActive="active">Dashboard</a>
      <a routerLink="/student/profile" routerLinkActive="active">Profile</a>
      <a routerLink="/student/jobs" routerLinkActive="active">Jobs</a>
      <a routerLink="/student/applications" routerLinkActive="active"
        >Applications</a
      >
    </nav>
  `,
  styles: [
    `
      .nav {
        display: flex;
        gap: 1rem;
      }

      .nav a {
        text-decoration: none;
        color: #333;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        transition: background-color 0.2s;
      }

      .nav a:hover {
        background-color: #f0f0f0;
      }

      .nav a.active {
        background-color: #007bff;
        color: white;
      }
    `,
  ],
})
export class StudentNavigationComponent {}
