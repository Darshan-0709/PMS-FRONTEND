import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-6">
      <h1 class="text-2xl font-bold mb-6">Job Opportunities</h1>

      <!-- <div class="mb-6 bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between">
          <div class="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search for jobs..."
              class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <span class="material-icons absolute left-3 top-2 text-gray-400"
              >search</span
            >
          </div>

          <div class="flex gap-2">
            <button
              class="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <span class="material-icons text-gray-500 text-sm mr-1"
                >filter_list</span
              >
              Filter
            </button>
            <button
              class="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <span class="material-icons text-gray-500 text-sm mr-1"
                >sort</span
              >
              Sort
            </button>
          </div>
        </div>
      </div> -->

      <div class="space-y-6">
        <!-- Placeholder for job listings -->
        <div class="bg-white rounded-lg shadow p-6 flex flex-col gap-2">
          <p class="text-lg font-medium text-gray-500">
            No job opportunities available at the moment.
          </p>
          <p class="text-gray-500">Check back later for new job postings from recruiters.</p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./jobs.component.css'],
})
export class JobsComponent {
  // Component logic will be implemented here
}
