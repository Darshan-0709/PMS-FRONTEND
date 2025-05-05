import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="layout-container">
      <header class="header">
        <div class="logo">PMS</div>
        <nav class="nav">
          <ng-content select="[nav]"></ng-content>
        </nav>
        <div class="user-menu">
          <ng-content select="[user-menu]"></ng-content>
        </div>
      </header>
      <div class="content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      .layout-container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }

      .header {
        display: flex;
        align-items: center;
        padding: 1rem;
        background-color: #fff;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .logo {
        font-size: 1.5rem;
        font-weight: bold;
        margin-right: 2rem;
      }

      .nav {
        flex: 1;
        display: flex;
        gap: 1rem;
      }

      .user-menu {
        margin-left: auto;
      }

      .content {
        flex: 1;
        padding: 2rem;
        background-color: #f8f9fa;
      }
    `,
  ],
})
export class MainLayoutComponent {
  @Input() title = 'Placement Management System';
}
