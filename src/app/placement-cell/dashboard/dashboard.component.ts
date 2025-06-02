import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-6">
      <h1 class="text-2xl font-bold mb-6">Placement Cell Dashboard</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Students card -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold mb-2">Students</h2>
          <div class="flex justify-between items-center">
            <span class="text-3xl font-bold text-blue-600">0</span>
            <div class="rounded-full bg-blue-100 p-3">
              <span class="material-icons text-blue-600">people</span>
            </div>
          </div>
          <p class="text-sm text-gray-500 mt-2">Registered students</p>
        </div>

        <!-- Job Requests card -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold mb-2">Job Requests</h2>
          <div class="flex justify-between items-center">
            <span class="text-3xl font-bold text-amber-600">0</span>
            <div class="rounded-full bg-amber-100 p-3">
              <span class="material-icons text-amber-600">inbox</span>
            </div>
          </div>
          <p class="text-sm text-gray-500 mt-2">Pending requests</p>
        </div>

        <!-- Active Drives card -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold mb-2">Active Drives</h2>
          <div class="flex justify-between items-center">
            <span class="text-3xl font-bold text-green-600">0</span>
            <div class="rounded-full bg-green-100 p-3">
              <span class="material-icons text-green-600">event</span>
            </div>
          </div>
          <p class="text-sm text-gray-500 mt-2">Ongoing placement drives</p>
        </div>

        <!-- Placements card -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold mb-2">Placements</h2>
          <div class="flex justify-between items-center">
            <span class="text-3xl font-bold text-purple-600">0</span>
            <div class="rounded-full bg-purple-100 p-3">
              <span class="material-icons text-purple-600">military_tech</span>
            </div>
          </div>
          <p class="text-sm text-gray-500 mt-2">Successful placements</p>
        </div>
      </div>

      <!-- Recent applications -->
      <div class="mt-8 bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Recent Applications</h2>
        <div class="space-y-4">
          <p class="text-gray-500 italic">No recent applications available.</p>
        </div>
      </div>

      <!-- Upcoming drives -->
      <div class="mt-8 bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Upcoming Drives</h2>
        <div class="space-y-4">
          <p class="text-gray-500 italic">No upcoming drives scheduled at the moment.</p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  // Dashboard logic will be implemented here
}
