import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentProfileComponent } from '../../../../shared/components/student-profile/student-profile.component';
import { ToastComponent } from '../../../../shared/components/toast/toast.component';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, StudentProfileComponent, ToastComponent],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-semibold mb-6">My Profile</h1>
      <app-student-profile
        [studentId]="currentUserId"
        [isPlacementCellView]="false"
      >
      </app-student-profile>
      <app-toast></app-toast>
    </div>
  `,
  styles: [],
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  currentUserId: string = '';

  ngOnInit(): void {
    // Get current user ID from auth service
    const currentUser = this.authService.user();
    if (currentUser) {
      this.currentUserId = currentUser.studentId || '123'; // Fallback to mock ID
    } else {
      // Use a mock ID if no user is found
      this.currentUserId = '123';
    }
  }
}
