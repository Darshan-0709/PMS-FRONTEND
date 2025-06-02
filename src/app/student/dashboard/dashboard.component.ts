import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-6">
      <h1 class="text-2xl font-bold mb-6">Student Dashboard</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Summary card for applications -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold mb-2">My Applications</h2>
          <div class="flex justify-between items-center">
            <span class="text-3xl font-bold text-indigo-600">0</span>
            <div class="rounded-full bg-indigo-100 p-3">
              <span class="material-icons text-indigo-600">description</span>
            </div>
          </div>
          <p class="text-sm text-gray-500 mt-2">Total job applications submitted</p>
        </div>

        <!-- Upcoming events card -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold mb-2">Upcoming Events</h2>
          <div class="flex justify-between items-center">
            <span class="text-3xl font-bold text-green-600">0</span>
            <div class="rounded-full bg-green-100 p-3">
              <span class="material-icons text-green-600">event</span>
            </div>
          </div>
          <p class="text-sm text-gray-500 mt-2">Upcoming placement drives</p>
        </div>

        <!-- Offers card -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold mb-2">Job Offers</h2>
          <div class="flex justify-between items-center">
            <span class="text-3xl font-bold text-purple-600">0</span>
            <div class="rounded-full bg-purple-100 p-3">
              <span class="material-icons text-purple-600">work</span>
            </div>
          </div>
          <p class="text-sm text-gray-500 mt-2">Job offers received</p>
        </div>
      </div>

      <!-- Recent job listings -->
      <div class="mt-8 bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Recent Job Opportunities</h2>
        <div class="space-y-4">
          <p class="text-gray-500 italic">No recent job postings available. Check back soon!</p>
        </div>
      </div>

      <!-- Active selection processes -->
      <div class="mt-8 bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Active Selection Processes</h2>
        <div class="space-y-4">
          <p class="text-gray-500 italic">No active selection processes at the moment.</p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  // Dashboard logic will be implemented here
}
