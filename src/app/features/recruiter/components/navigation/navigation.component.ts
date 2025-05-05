import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-recruiter-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="nav">
      <a routerLink="/recruiter/dashboard" routerLinkActive="active"
        >Dashboard</a
      >
      <a routerLink="/recruiter/profile" routerLinkActive="active">Profile</a>
      <a routerLink="/recruiter/jobs" routerLinkActive="active">Jobs</a>
      <a routerLink="/recruiter/applicants" routerLinkActive="active"
        >Applicants</a
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
export class RecruiterNavigationComponent {}
