import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-drives',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-6">
      <h1 class="text-2xl font-bold mb-6">Drive Schedule</h1>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="mb-6">
          <p class="text-gray-600 mb-4">
            Schedule and manage your recruitment drives at different institutions.
          </p>
        </div>

        <div class="space-y-4">
          <!-- Placeholder for drives list -->
          <p class="text-gray-500 italic">No drives scheduled at the moment.</p>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class DrivesComponent {
  // Component logic will be implemented here
}
