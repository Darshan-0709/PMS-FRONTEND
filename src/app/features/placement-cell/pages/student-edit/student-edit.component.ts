import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-student-edit',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Edit Student Profile</h1>
        <button class="btn btn-sm btn-soft btn-primary" (click)="goBack()">
          Back to List
        </button>
      </div>

      @if (isLoading) {
      <div class="flex justify-center items-center h-64">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"
        ></div>
      </div>
      } @else {
      <div class="bg-white rounded-lg shadow-md p-6">
        <p class="text-gray-600">
          This is a placeholder for the student edit form. The full
          implementation will include a form for editing student details.
        </p>
      </div>
      }
    </div>
  `,
})
export class StudentEditComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private studentService = inject(StudentService);
  private toastService = inject(ToastService);

  studentId: string = '';
  isLoading: boolean = true;

  ngOnInit(): void {
    this.studentId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.studentId) {
      this.toastService.show('No student ID provided', 'error');
      this.goBack();
      return;
    }

    // Simulate loading
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  goBack(): void {
    this.router.navigate(['/placement-cell/students']);
  }
}
