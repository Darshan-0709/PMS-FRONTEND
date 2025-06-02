import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-6">
      <h1 class="text-2xl font-bold mb-6">Candidate Applications</h1>

      <div class="mb-6 bg-white rounded-lg shadow p-4">
        <div class="flex flex-wrap gap-4 justify-between items-center">
          <div class="relative w-full md:w-auto flex-grow max-w-md">
            <input
              type="text"
              placeholder="Search applications..."
              class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <span class="material-icons absolute left-3 top-2 text-gray-400">search</span>
          </div>

          <div class="flex flex-wrap gap-2">
            <button
              class="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <span class="material-icons text-gray-500 text-sm mr-1">filter_list</span>
              Filter
            </button>
            <button
              class="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <span class="material-icons text-gray-500 text-sm mr-1">sort</span>
              Sort
            </button>
            <div class="px-4 py-2 text-sm rounded-lg flex items-center gap-2">
              <span class="font-medium">Status:</span>
              <select class="py-1 px-2 border border-gray-300 rounded">
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
                <option value="selected">Selected</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <!-- Placeholder for applications list -->
        <div class="bg-white rounded-lg shadow p-6 text-center">
          <span class="material-icons text-gray-400 text-5xl mb-3">inbox</span>
          <p class="text-lg font-medium text-gray-500">No applications received yet</p>
          <p class="text-gray-500 mt-1">
            Applications will appear here once students apply to your job postings.
          </p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./applications.component.css'],
})
export class ApplicationsComponent {
  // Component logic will be implemented here
}
