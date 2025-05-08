import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-criteria',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-6">
      <h1 class="text-2xl font-bold mb-6">Eligibility Criteria</h1>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="mb-6">
          <p class="text-gray-600 mb-4">
            Define and manage eligibility criteria for your job postings.
          </p>
        </div>

        <div class="space-y-4">
          <!-- Placeholder for criteria list -->
          <p class="text-gray-500 italic">
            No eligibility criteria defined at the moment.
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class CriteriaComponent {
  // Component logic will be implemented here
}
