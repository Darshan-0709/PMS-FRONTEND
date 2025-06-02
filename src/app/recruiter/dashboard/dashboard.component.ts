import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-6">
      <h1 class="text-2xl font-bold mb-6">Recruiter Dashboard</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Job Postings card -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold mb-2">Job Postings</h2>
          <div class="flex justify-between items-center">
            <span class="text-3xl font-bold text-blue-600">0</span>
            <div class="rounded-full bg-blue-100 p-3">
              <span class="material-icons text-blue-600">work</span>
            </div>
          </div>
          <p class="text-sm text-gray-500 mt-2">Active job postings</p>
        </div>

        <!-- Applications card -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold mb-2">Applications</h2>
          <div class="flex justify-between items-center">
            <span class="text-3xl font-bold text-teal-600">0</span>
            <div class="rounded-full bg-teal-100 p-3">
              <span class="material-icons text-teal-600">description</span>
            </div>
          </div>
          <p class="text-sm text-gray-500 mt-2">Received applications</p>
        </div>

        <!-- Offers card -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold mb-2">Offers Made</h2>
          <div class="flex justify-between items-center">
            <span class="text-3xl font-bold text-emerald-600">0</span>
            <div class="rounded-full bg-emerald-100 p-3">
              <span class="material-icons text-emerald-600">assignment_turned_in</span>
            </div>
          </div>
          <p class="text-sm text-gray-500 mt-2">Placement offers extended</p>
        </div>
      </div>

      <!-- Active Drives -->
      <div class="mt-8 bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Active Recruitment Drives</h2>
        <div class="space-y-4">
          <p class="text-gray-500 italic">No active recruitment drives at the moment.</p>
        </div>
      </div>

      <!-- Target Colleges -->
      <div class="mt-8 bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Target Colleges</h2>
        <div class="space-y-4">
          <p class="text-gray-500 italic">No target colleges selected yet.</p>
        </div>
      </div>

      <!-- Application Statistics -->
      <div class="mt-8 bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Application Statistics</h2>
        <div class="space-y-4">
          <p class="text-gray-500 italic">No application data available yet.</p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  // Dashboard logic will be implemented here
}
