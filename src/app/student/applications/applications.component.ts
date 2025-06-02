import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-6">
      <h1 class="text-2xl font-bold mb-6">My Applications</h1>

      <div class="mt-8 bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Recent Job Opportunities</h2>
        <div class="space-y-4">
          <p class="text-gray-500 italic">No recent job postings available. Check back soon!</p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./applications.component.css'],
})
export class ApplicationsComponent {
  // Component logic will be implemented here
}
