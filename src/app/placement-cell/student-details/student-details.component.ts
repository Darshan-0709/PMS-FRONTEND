import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { StudentProfileComponent } from '../../shared/pages/student-profile/student-profile.component';

@Component({
  selector: 'app-student-details',
  standalone: true,
  imports: [CommonModule, StudentProfileComponent, ToastComponent],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex items-center mb-6">
        <button (click)="goBack()" class="btn btn-md btn-soft btn-info mr-4">
          &larr; Back to Students
        </button>
        <h1 class="text-3xl font-semibold">Student Profile</h1>
      </div>

      @if (studentId) {
        <app-student-profile> </app-student-profile>
        <!-- [studentId]="studentId" s -->
      } @else {
        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p class="text-yellow-700">No student ID provided.</p>
        </div>
      }

      <app-toast></app-toast>
    </div>
  `,
  styles: [],
})
export class StudentDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  studentId: string = '';

  ngOnInit(): void {
    // Get student ID from route parameters
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.studentId = id;
      } else {
        // Handle case where no ID is provided
        console.error('No student ID provided');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/placement-cell/students']);
  }
}
