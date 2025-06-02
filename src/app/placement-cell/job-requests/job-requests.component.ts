import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-job-requests',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-6">
      <h1 class="text-2xl font-bold mb-6">Job Requests</h1>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="mb-6">
          <p class="text-gray-600 mb-4">Manage and review job requests from recruiters.</p>
        </div>

        <div class="space-y-4">
          <!-- Placeholder for job requests list -->
          <p class="text-gray-500 italic">No job requests available at the moment.</p>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class JobRequestsComponent {
  // Component logic will be implemented here
}
