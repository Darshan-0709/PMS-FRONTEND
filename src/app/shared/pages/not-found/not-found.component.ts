import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div class="text-gray-500 text-6xl mb-4">404</div>
        <h1 class="text-2xl font-bold mb-4">Page Not Found</h1>
        <p class="text-gray-600 mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div class="flex justify-center">
          <a
            routerLink="/"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class NotFoundComponent {}
