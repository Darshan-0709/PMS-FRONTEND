import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-6">
      <h1 class="text-2xl font-bold mb-6">Job Postings</h1>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="mb-6">
          <p class="text-gray-600 mb-4">
            Create and manage your job postings for different institutions.
          </p>
        </div>

        <div class="space-y-4">
          <!-- Placeholder for job postings list -->
          <p class="text-gray-500 italic">
            No job postings available at the moment.
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class JobsComponent {
  // Component logic will be implemented here
}
