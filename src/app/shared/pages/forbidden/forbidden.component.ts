import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div class="text-red-500 text-6xl mb-4">403</div>
        <h1 class="text-2xl font-bold mb-4">Access Forbidden</h1>
        <p class="text-gray-600 mb-6">You don't have permission to access this resource.</p>
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
export class ForbiddenComponent {}
